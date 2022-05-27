//
//  ClearButton.swift
//  madiyarProject
//
//  Created by Bauyrzhan on 14.08.2021.
//

import Foundation
import UIKit


class ClearButton: UIButton {
    
    required init?(coder: NSCoder) {fatalError("")}
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        layer.cornerRadius = 14
        setImage(UIImage(named: "clearIcon")?.withRenderingMode(.alwaysOriginal), for: .normal)
        layer.masksToBounds = true
    }
    
}
