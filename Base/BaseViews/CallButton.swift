//
//  CallButton.swift
//  madiyarProject
//
//  Created by Bauyrzhan on 08.06.2021.
//

import Foundation
import UIKit

class CallButton: UIButton {
    
    required init?(coder: NSCoder) {fatalError("")}
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        backgroundColor = .lightMainColor
        layer.cornerRadius = 14
        setImage(UIImage(named: "callIcon")?.withRenderingMode(.alwaysOriginal), for: .normal)
        layer.masksToBounds = true
    }
    
}

