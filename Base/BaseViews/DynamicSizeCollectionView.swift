//
//  DynamicSizeCollectionView.swift
//  madiyarProject
//
//  Created by Bauyrzhan on 03.10.2021.
//


import Foundation
import UIKit

class DynaminHeightCollectionView: UICollectionView {
    
    override func layoutSubviews() {
        super.layoutSubviews()
        
        if !__CGSizeEqualToSize(bounds.size, self.intrinsicContentSize) {
            self.invalidateIntrinsicContentSize()
        }
    }
    
    override var intrinsicContentSize: CGSize {
        return contentSize
    }
    
}
