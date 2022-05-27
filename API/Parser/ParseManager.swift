//
//  ParseManager.swift
//  JTI
//
//  Created by Nursultan on 10/17/19.
//  Copyright © 2019 Nursultan. All rights reserved.
//

import Foundation

class ParseManager {

    static let shared = ParseManager()

    let networkManager: NetworkManager = NetworkRouter(parser: CustomParser())

    private init() {}

    func multipartFormData<T: Decodable>(url: String, parameters: Parameters? = nil, completion: @escaping (T?, String?) -> ()) -> Void {
        

        let endpoint = Endpoints.multipartFormData(url: url, parameters: parameters)

        self.networkManager.request(endpoint) { (result: Result<T>) in
            switch result {
            case .failure(let error):
                if error == "Internal server error" {
                    UserManager.shared.deleteCurrentSession()
                    AppCenter.shared.start()
                }
                DispatchQueue.main.async {
                    completion(nil, error)
                }
            case .success(let value):
                DispatchQueue.main.async {
                    completion(value, nil)
                }
            }
        }
    }

    func postRequest<T: Decodable>(url: String, parameters: Parameters? = nil, completion: @escaping (T?, String?) -> ()) -> Void {


        let endpoint = Endpoints.post(url: url, parameters: parameters)

        self.networkManager.request(endpoint) { (result: Result<T>) in
            switch result {
            case .failure(let error):
                DispatchQueue.main.async {
                    completion(nil, error)
                }
            case .success(let value):
                DispatchQueue.main.async {
                    completion(value, nil)
                }
            }
        }
    }
    func putRequest<T: Decodable>(url: String, parameters: Parameters? = nil, completion: @escaping (T?, String?) -> ()) -> Void {


        let endpoint = Endpoints.post(url: url, parameters: parameters)

        self.networkManager.request(endpoint) { (result: Result<T>) in
            switch result {
            case .failure(let error):
                DispatchQueue.main.async {
                    completion(nil, error)
                }
            case .success(let value):
                DispatchQueue.main.async {
                    completion(value, nil)
                }
            }
        }
    }


    func getRequest<T: Decodable>(url: String, parameters: Parameters? = nil, completion: @escaping (T?, String?) -> ()) -> Void {
    

        let endpoint = Endpoints.get(url: url, parameters: parameters)

        self.networkManager.request(endpoint) { (result: Result<T>) in
            switch result {
            case .failure(let error):
                DispatchQueue.main.async {
                    completion(nil, error)
                }
            case .success(let value):
                DispatchQueue.main.sync {
                    completion(value, nil)
                }
            }
        }
    }

    func deleteRequest<T: Decodable>(url: String, parameters: Parameters? = nil, token: String? = nil, completion: @escaping (T?, String?) -> ()) -> Void {
        print("LOG_Parameters", parameters as Any, token as Any)

        let endpoint = Endpoints.delete(url: url, parameters: parameters)

        let dispatch = DispatchQueue.global(qos: .utility)

        dispatch.async {
            self.networkManager.request(endpoint) { (result: Result<T>) in
                switch result {
                case .failure(let error):
                    DispatchQueue.main.async {
                        completion(nil, error)
                    }
                case .success(let value):
                    DispatchQueue.main.async {
                        completion(value, nil)
                    }
                }
            }
        }
    }

}
