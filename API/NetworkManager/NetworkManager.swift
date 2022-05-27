//
//  NetworkManager.swift
//  NetworkManager
//
//  Created by Yerassyl Zhassuzakhov on 4/30/19.
//  Copyright © 2019 Yerassyl Zhassuzakhov. All rights reserved.
//

import Foundation

protocol NetworkManager {
    func request<T: Decodable>(_ route: EndpointType, completion: @escaping (Result<T>) -> Void)
    func cancel()
}

