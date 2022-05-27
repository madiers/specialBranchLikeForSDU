//
//  Endpoints.swift
//  ThousandAR
//
//  Created by Nursultan on 1/15/20.
//  Copyright © 2020 Nursultan. All rights reserved.
//

import Foundation

enum Endpoints: EndpointType {
    
    case get(url: String, parameters: Parameters?)
    case post(url: String, parameters: Parameters?)
    case put(url: String, parameters: Parameters?)
    case multipartFormData(url: String, parameters: Parameters?)
    case delete(url: String, parameters: Parameters?)

    var baseUrl: URL {
        return URL(string: "\(API.baseURL)api/")!
    }

    var path: String {
        switch self {
        case .get(let url, _):
            return url
        case .post(let url, _):
            return url
        case .put(let url, _):
            return url
        case .multipartFormData(let url, _):
            return url
        case .delete(let url, _):
            return url
        }
    }

    var httpMethod: HTTPMethod {
        switch self {
        case .post(_, _):
            return .post
        case .put(_, _):
            return .put
        case .multipartFormData(_, _):
            return .post
        case .delete(_, _):
            return .delete
        default:
            return .get
        }
    }

    var task: HTTPTask {
        var headers: HTTPHeaders = [:]
        var urlParameters: Parameters = [:]
        var bodyParameters: Parameters = [:]
        headers["Authorization"] = "Bearer \(UserManager.shared.getToken() ?? "")"
        print("USER_TOKEN", UserManager.shared.getToken() ?? "")
        switch self {
        case .get(_, let parameters):
            if let params = parameters {
                urlParameters = params
            }
            return .requestParametersAndHeaders(bodyParameters: nil,
                                                urlParameters: urlParameters,
                                                additionalHeaders: headers)
        case .post(_, let parameters):
            
            if let params = parameters {
                bodyParameters = params
            }
            return .requestParametersAndHeaders(bodyParameters: bodyParameters,
                                                urlParameters: nil,
                                                additionalHeaders: headers)
        case let .multipartFormData(_, parameters):
            if let params = parameters {
                bodyParameters = params
            }
            return .multipartFormData(bodyParameters: bodyParameters,
                                      urlParameters: nil,
                                      additionalHeader: headers)
         case let .delete(_, parameters):
            if let params = parameters {
                urlParameters = params
            }
            return .requestParametersAndHeaders(bodyParameters: nil,
                                                urlParameters: urlParameters,
                  
                                                additionalHeaders: headers)
        case .put(_, let parameters):
            if let params = parameters {
                bodyParameters = params
            }
            return .requestParametersAndHeaders(bodyParameters: bodyParameters,
                                                urlParameters: nil,
                                                additionalHeaders: headers)
        }

    }


}
