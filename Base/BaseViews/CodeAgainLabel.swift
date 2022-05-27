//
//  CodeAgainLabel.swift
//  madiyarProject
//
//  Created by Bauyrzhan on 04.06.2021.
//

import Foundation
import UIKit

class CodeAgainLabel: UIButton {
    
    required init?(coder: NSCoder) {fatalError("")}
    
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    
    func setPhoneNumber(phoneNumber:String) {
        let firstAttributes: [NSAttributedString.Key: Any] = [NSAttributedString.Key.foregroundColor: UIColor.logoTextColor, NSAttributedString.Key.font: UIFont.init(name: Font.interRegular, size: 12)!]
        
        let secondAttributes : [NSAttributedString.Key : Any] =  [NSAttributedString.Key.foregroundColor: UIColor.logoTextColor, NSAttributedString.Key.font: UIFont.init(name: Font.interBold, size: 12)!]
        
        let firstString = NSMutableAttributedString(string: "Мы отправили код на номер ", attributes: firstAttributes)
        let secondString = NSAttributedString(string: "\(phoneNumber)", attributes: secondAttributes)
        
        firstString.append(secondString)
        
        titleLabel?.numberOfLines = 0
        titleLabel?.textAlignment = .center
        print(firstString)
        
        setAttributedTitle(firstString, for: .normal)
    }
}

