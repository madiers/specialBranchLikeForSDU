//
//  CodeTimerLabel.swift
//  madiyarProject
//
//  Created by Bauyrzhan on 04.06.2021.
//

import Foundation
import UIKit

class CodeTimerLabel: UIButton {
    //MARK: - Properties
    
    lazy var firstString: NSMutableAttributedString = {
        let firstAttributes: [NSAttributedString.Key: Any] = [NSAttributedString.Key.foregroundColor: UIColor.logoTextColor, NSAttributedString.Key.font: UIFont.init(name: Font.interRegular, size: 12)!]
        let firstString = NSMutableAttributedString(string: "Запросить новый код можно будет через ", attributes: firstAttributes)
        return firstString
    }()
    
    required init?(coder: NSCoder) {fatalError("")}
    
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    
    func setSecondTimer(timeSecond:String) {
        
        let secondAttributes : [NSAttributedString.Key : Any] =  [NSAttributedString.Key.foregroundColor: UIColor.logoTextColor, NSAttributedString.Key.font: UIFont.init(name: Font.interBold, size: 12)!]
        
        let secondString = NSAttributedString(string: "\(timeSecond) секунд", attributes: secondAttributes)
        
        firstString.append(secondString)
        
        titleLabel?.numberOfLines = 0
        titleLabel?.textAlignment = .center
        
        setAttributedTitle(firstString, for: .normal)
    }
}

