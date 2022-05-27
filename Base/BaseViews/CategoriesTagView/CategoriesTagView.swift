//
//  CategoriesTagView.swift
//  madiyarProject
//
//  Created by Bauyrzhan on 03.10.2021.
//

import Foundation
import UIKit


class CategoriesTagsView: UIView {
    
    public var categoriesList: [StoreCategory] = []
    public var selectedIds: [String] = []
    private let cellId = "discountCell"
    public var isEdit = false
    public var isSelected = false
    weak var delegate: CategoriesTagDelegate?
    
    lazy var collectionView : DynaminHeightCollectionView = {
        let layout = UICollectionViewFlowLayout()
        let cv = DynaminHeightCollectionView(frame: CGRect.zero, collectionViewLayout: layout)
        cv.delegate = self
        cv.dataSource = self
        cv.backgroundColor = .clear
        cv.register(CategoriesTagViewCell.self, forCellWithReuseIdentifier: cellId)
        return cv
    }()
    
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        addSubview(collectionView)
        
        collectionView.snp.makeConstraints { (make) in
            make.top.equalToSuperview()
            make.bottom.equalToSuperview().offset(-16)
            make.left.equalToSuperview()
            make.right.equalToSuperview()
        }
        
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension CategoriesTagsView: UICollectionViewDataSource, UICollectionViewDelegate, UICollectionViewDelegateFlowLayout{
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return categoriesList.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: cellId, for: indexPath) as! CategoriesTagViewCell
        let title = (categoriesList[indexPath.row].name ?? "") + "(\(categoriesList[indexPath.row].amount ?? 0))"
        cell.removeView.isHidden = !isEdit
        cell.tagLabel.text = title
        cell.selectCategory(flag: selectedIds
                                .contains(categoriesList[indexPath.row]._id ?? ""))
       
        return cell
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        let text = (categoriesList[indexPath.row].name ?? "") + "(\(categoriesList[indexPath.row].amount ?? 0))"
        let cellWidth = text.size(withAttributes:[.font: UIFont.init(name: Font.interMedium, size: 14)!]).width + 55
        
        return CGSize(width: cellWidth, height: 32.0)
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        if isSelected {
            if selectedIds.contains(categoriesList[indexPath.row]._id ?? "") {
                if let index = selectedIds.firstIndex(of: categoriesList[indexPath.row]._id
                                                        ?? ""){
                    selectedIds.remove(at: index)
                }
            }
            else {
                selectedIds.append(categoriesList[indexPath.row]._id ?? "")
            }
            collectionView.reloadData()
        }
        else {
            if isEdit {
                delegate?.tapDelete(id: categoriesList[indexPath.row]._id ?? "",
                                    index: indexPath.row)
            }
            else {
                delegate?.tapEdit(id: categoriesList[indexPath.row]._id ?? "",
                                  index: indexPath.row)
            }
            
        }
    }
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, insetForSectionAt section: Int) -> UIEdgeInsets {
            return UIEdgeInsets(top: 0, left: 16, bottom: 20, right: 20)
    }
    
}

protocol CategoriesTagDelegate: AnyObject {
    func tapDelete(id: String, index: Int)
    func tapEdit(id: String, index: Int)
}
