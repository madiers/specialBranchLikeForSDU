//
//  ScrollViewController.swift
//  madiyarProject
//
//  Created by Bauyrzhan on 03.06.2021.
//

import Foundation
import UIKit
import SnapKit

class ScrollViewController: UIViewController {
    
    //MARK: - Properties
    lazy var scrollView = UIScrollView()
    
    lazy var contentView: UIView = {
        let view = UIView()
        view.backgroundColor = .white
        return view
    }()
    
    
    //MARK: - Start functions
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.navigationController?.navigationBar.tintColor = .mainColor
        navigationItem.backButtonTitle = ""
        Router.shared.setCurrentViewController(self)

    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(true)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        scrollView.backgroundColor = .white
        
        setupScrollView()
        hideKeyboardWhenTappedAround()
    }
    


    //MARK: - Setup functions
    func setupScrollView() {
        view.backgroundColor = .white
        
        
        scrollView.alwaysBounceVertical = true
        scrollView.showsVerticalScrollIndicator = false
        scrollView.keyboardDismissMode = .onDrag
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        
        scrollView.snp.makeConstraints { (make) in
            make.edges.equalToSuperview()
            make.width.equalTo(UIScreen.main.bounds.width)
        }
        
        contentView.snp.makeConstraints { (make) in
            make.edges.equalToSuperview()
            make.width.equalTo(view)
        }
    }
    @objc func tapBack() {
        Router.shared.pop()
    }
    
    //MARK: - functions
    func addToScrollView(_ views: [UIView]) -> Void {
        for view in views {
            scrollView.addSubview(view)
        }
    }
    
}
