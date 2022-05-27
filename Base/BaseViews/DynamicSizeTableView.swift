//
//  DynamicSizeTableView.swift
//  madiyarProject
//
//  Created by Bauyrzhan on 06.06.2021.
//

import Foundation
import UIKit

public class DynamicSizeTableView: UITableView
{
    override public func layoutSubviews() {
        super.layoutSubviews()
        if bounds.size != intrinsicContentSize {
            invalidateIntrinsicContentSize()
        }
    }

    override public var intrinsicContentSize: CGSize {
        return contentSize
    }
}
