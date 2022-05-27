//
//  GenericResponse.swift
//  Inviterkz
//
//  Created by Yerassyl Zhassuzakhov on 5/13/19.
//  Copyright © 2019 Yerassyl Zhassuzakhov. All rights reserved.
//

import Foundation

class Response<T: Decodable>: Decodable {
    let message: [String]?
    let data: T?
    let statusCode: String?
    let success:Bool?
    let error:String?
}

struct AuthResponse: Codable {
    let message: [String]?
    let statusCode: Int?
    let _id:String?
    let id: String?
    let result: Bool?
    let registrationToken:String?
    let token: String? 
    let error:String?
    
}


struct Pagination<T: Codable>: Codable {
    let page: Int
    let data: [T]
    let count: Int
    let limit: Int
    let offset: Int
}

