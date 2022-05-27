//
//  CategoriesTagViewCell.swift
//  madiyarProject
//
//  Created by Bauyrzhan on 03.10.2021.
//

import Foundation
import UIKit

class CategoriesTagViewCell: UICollectionViewCell {
    
    lazy var tagLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.init(name: Font.interMedium, size: 14)
        label.textColor = .mainColor
        return label
    }()
    
    lazy var removeView: UIImageView = {
        let view = UIImageView()
        view.image = UIImage(named: "removeBtn")
        return view
    }()
    
    override init(frame: CGRect) {
        super.init(frame: .zero)
        backgroundColor = .lightMainColor
        layer.cornerRadius = 16
        
        setupViews()
        
    }
    
    func setupViews() {
        addSubview(tagLabel)
        tagLabel.snp.makeConstraints { (make) in
            make.top.equalTo(6)
            make.left.equalTo(9)
            
        }
        addSubview(removeView)
        removeView.snp.makeConstraints { make in
            make.centerY.equalTo(tagLabel)
            make.left.equalTo(tagLabel.snp.right).offset(8)
            make.right.lessThanOrEqualToSuperview().offset(-16)
        }
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func selectCategory(flag: Bool) {
        backgroundColor = flag ? .blueColor : .lightGrayColor
        tagLabel.textColor = flag ? .white : .mainColor
    }
    
}
 
