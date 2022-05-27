//
//  NetworkRouter.swift
//  NetworkManager
//
//  Created by Yerassyl Zhassuzakhov on 4/30/19.
//  Copyright © 2019 Yerassyl Zhassuzakhov. All rights reserved.
//

import Foundation

class NetworkRouter: NetworkManager {
    private var task: URLSessionTask?
    private let parser: Parser
    
    public init(parser: Parser) {
        self.parser = parser
    }
    
    func request<T: Decodable>(_ route: EndpointType, completion: @escaping (Result<T>) -> Void) {
        let session = URLSession.shared
        do {
            let request = try self.buildRequest(from: route)
            task = session.dataTask(with: request, completionHandler: { (data, response, error) in
                completion(self.parser.parse(data: data, response: response, error: error))
            })
        } catch {
            
            completion(.failure(error.localizedDescription))
        }
        self.task?.resume()
    }
    
    public func cancel() {
        self.task?.cancel()
    }
    
    func buildRequest(from route: EndpointType) throws -> URLRequest {
        var request = URLRequest(url: route.baseUrl.appendingPathComponent(route.path), cachePolicy: .reloadIgnoringLocalAndRemoteCacheData, timeoutInterval: 15.0)
        request.httpMethod = route.httpMethod.rawValue
        print("URL:", route.baseUrl.appendingPathComponent(route.path))
        do {
            switch route.task {
            case .request:
                request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            case let .requestParameters(bodyParameters, urlParameters):
                request.setValue("application/json", forHTTPHeaderField: "Content-Type")
                try self.configureParameters(bodyParameters: bodyParameters, urlParameters: urlParameters, request: &request)
            case let .requestParametersAndHeaders(bodyParameters, urlParameters, additionalHeaders):
                request.setValue("application/json", forHTTPHeaderField: "Content-Type")
                self.addAdditionalHeaders(additionalHeaders, request: &request)
                try self.configureParameters(bodyParameters: bodyParameters, urlParameters: urlParameters, request: &request)
            case let .multipartFormData(bodyParameters, _, headers):
                self.addAdditionalHeaders(headers, request: &request)
                let boundary = generateBoundaryString()
                request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
                request.httpBody = createBody(bodyParameters, boundary: boundary)
            }
            return request
        } catch {
            throw error
        }
    }
    
    fileprivate func configureParameters(bodyParameters: Parameters?, urlParameters: Parameters?, request: inout URLRequest) throws {
        do {
            if let bodyParameters = bodyParameters {
                try JSONParameterEncoder.encode(urlRequest: &request, with: bodyParameters)
            }
            if let urlParameters = urlParameters {
                try URLParameterEncoder.encode(urlRequest: &request, with: urlParameters)
            }
        } catch {
            throw error
        }
    }
    
    fileprivate func addAdditionalHeaders(_ additionalHeaders: HTTPHeaders?, request: inout URLRequest) {
        guard let headers = additionalHeaders else { return }
        for (key, value) in headers {
            request.setValue(value, forHTTPHeaderField: key)
        }
    }
    
    fileprivate func generateBoundaryString() -> String {
        return "Boundary-\(UUID().uuidString)"
    }
    
    public func createBody(_ params: [String: Any]?,
                           boundary: String) -> Data {
        let body = NSMutableData()
        guard let params = params else { return body as Data }
        for (key, value) in params {
            if let dict = value as? NSDictionary {
                for (multiFileKey, multiFileValue) in dict {
                    if let data = multiFileValue as? Data {
                        setImageData(body: body, data: data, key: multiFileKey, value: multiFileValue, boundary: boundary)
                    }
                }
            } else if let data = value as? Data {
                setImageData(body: body, data: data, key: key, value: value, boundary: boundary)
            }
            else if let url = value as? URL {
                setURLData(body: body, data: url, key: key, value: value, boundary: boundary)
            }
            else {
                setValueData(body: body, key: key, value: value, boundary: boundary)
            }
        }
        
        return body as Data
    }

    private func setImageData(body: NSMutableData, data: Data, key: Any, value: Any, boundary: String) -> Void {
        let mimeTypeLocal = mimeType(for: data)
        body.append(Data("--\(boundary)\r\n".utf8))
        var valueString = "\(value)".trimmingCharacters(in: .whitespaces)
        valueString = valueString.replacingOccurrences(of: " ", with: "")
        body.append(Data("Content-Disposition: form-data; name=\"\(key)\"; filename=\"\(valueString).\(fileExtension(for: data))\"\r\n".utf8))
        body.append(Data("Content-Type: \(mimeTypeLocal)\r\n\r\n".utf8))
        body.append(data)
        body.append(Data("\r\n".utf8))
        body.append(Data("--\(boundary)--\r\n".utf8))
    }
    
    private func setURLData(body: NSMutableData, data: URL, key: Any, value: Any, boundary: String) -> Void {
        
        let mimeTypeLocal = mimeType(for: data.loadFileFromLocalPath() ?? Data())
        body.append(Data("--\(boundary)\r\n".utf8))
        var valueString = "\(value)".trimmingCharacters(in: .whitespaces)
        valueString = valueString.replacingOccurrences(of: " ", with: "")
        body.append(Data("Content-Disposition: form-data; name=\"\(key)\"; filename=\"\(valueString).\(data.pathExtension)\"\r\n".utf8))
        body.append(Data("Content-Type: \(mimeTypeLocal)\r\n\r\n".utf8))
        body.append(data.loadFileFromLocalPath() ?? Data())
        body.append(Data("\r\n".utf8))
        body.append(Data("--\(boundary)--\r\n".utf8))
    }

    private func setValueData(body: NSMutableData, key: Any, value: Any, boundary: String) -> Void {
        body.append(Data("--\(boundary)\r\n".utf8))
        body.append(Data("Content-Disposition: form-data; name=\"\(key)\"\r\n\r\n".utf8))
        body.append(Data("\(value)\r\n".utf8))
        body.append(Data("--\(boundary)--\r\n".utf8))
    }
    
    fileprivate func mimeType(for data: Data) -> String {
        var b: UInt8 = 0
        data.copyBytes(to: &b, count: 1)
        switch b {
        case 0xFF, 0xD8, 0x4D, 0x2A, 0x47, 0x49, 0x89, 0x50, 0x4E:
            return "image/jpeg"
        case 0x25:
            return "application/pdf"
        case 0xD0:
            return "application/vnd"
        case 0x46:
            return "text/plain"
        case 0x1C, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x34, 0x32, 0x00:
            return "video/mp4"
        default:
            return "application/octet-stream"
        }
    }

    fileprivate func fileExtension(for data: Data) -> String {
        var b: UInt8 = 0
        data.copyBytes(to: &b, count: 1)
        
        switch b {
        case 0xFF, 0xD8, 0x4D, 0x2A, 0x47, 0x49, 0x89, 0x50, 0x4E:
            return "jpeg"
        case 0x25:
            return "pdf"
        case 0xD0:
            return "vnd"
        case 0x46:
            return "txt"
        case 0x1C, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x34, 0x32, 0x00:
            return "mp4"
        default:
            return "jpeg"
        }
    }
}
