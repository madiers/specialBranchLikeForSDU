//
//  BottomBorderTF.swift
//  madiyarProject
//
//  Created by Bauyrzhan on 04.06.2021.
//

import Foundation
import UIKit

class BottomBorderTF: UITextField {

    override init(frame: CGRect) {
        super.init(frame: frame)
        layer.borderColor = UIColor.mainColor.cgColor
        layer.backgroundColor = UIColor.white.cgColor
        layer.borderWidth = 0.0
        layer.shadowOffset = CGSize(width: 0, height: 4.0)
        layer.shadowOpacity = 1.0
        layer.shadowColor = UIColor.mainColor.cgColor
        layer.shadowRadius = 0.0
        textColor = .mainColor
        keyboardType = .numberPad
        textAlignment = .center
        font = UIFont.init(name: Font.interMedium, size: 15)
    }
    
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
