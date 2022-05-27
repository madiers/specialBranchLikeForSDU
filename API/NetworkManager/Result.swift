//
//  Result.swift
//  NetworkManager
//
//  Created by Yerassyl Zhassuzakhov on 5/14/19.
//  Copyright © 2019 Yerassyl Zhassuzakhov. All rights reserved.
//

import Foundation

public enum Result<T: Decodable> {
    case failure(String)
    case success(T)
}
