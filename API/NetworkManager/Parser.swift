import Foundation

public protocol Parser {
    func parse<T: Decodable>(data: Data?, response: URLResponse?, error: Error?) -> Result<T>
}

public class CustomParser: Parser {
    public init() {}

    public func parse<T>(data: Data?, response: URLResponse?, error: Error?) -> Result<T> where T : Decodable {
        if let error = error {
            return .failure(error.localizedDescription)
        }
        guard let response = response as? HTTPURLResponse else { return .failure("Response is not in HTTPResponse format") }
        switch response.statusCode {
        case 200:
            guard let data = data else { return .failure(NetworkResponse.noData.rawValue) }
          
            return decode(data)
       
        case 201...499:
            guard let data = data else { return .failure(NetworkResponse.noData.rawValue) }
            if data.count == 0 {
                return decodeVoid(data, code: response.statusCode)
            }
            else{
                return decode(data)
            }
        case 300...399:
            return .failure(NetworkResponse.redirect.rawValue)
        case 500...501:
            guard let data = data else { return .failure(NetworkResponse.noData.rawValue) }
            let jsonString = String(data: data, encoding: .utf8)!
            print("JSONSTRING: ", jsonString)
        
            return .failure(NetworkResponse.internalServerError.rawValue)
            
        case 600:
            return .failure(NetworkResponse.outdated.rawValue)
        default:
            return .failure(NetworkResponse.failed.rawValue)
        }
    }

    private func decode<T: Decodable>(_ data: Data) -> Result<T> {
        let decoder = JSONDecoder()
        
        do {
            print(try decoder.decode(T.self, from: data))
            let response = try decoder.decode(T.self, from: data)
            
            return Result.success(response)
        } catch {
            if T.self == String.self, let message = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as? String {
                return Result.success(message as! T)
            } else if let response = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as? T {
                return Result.success(response)
            }
            
            return .failure("Ошибка с сервером: \(error)")
        }
    }
    
    private func decodeVoid<T: Decodable>(_ data: Data,
                                          code: Int) -> Result<T> {
       
        let response = AuthResponse(message:nil, statusCode: code, _id: nil, id: nil, result: nil, registrationToken: nil, token: nil, error:nil)
            
        let decoder = JSONDecoder()
        
        do {
            print(try decoder.decode(T.self, from: data))
            let response = try decoder.decode(T.self, from: data)
            
            return Result.success(response)
            
        }
        catch{
            return Result.success((response as? T) ?? ([] as! T))
        }
    }


}
