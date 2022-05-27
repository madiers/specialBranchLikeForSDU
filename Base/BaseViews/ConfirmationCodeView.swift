//
//  ConfirmationCodeView.swift
//  madiyarProject
//
//  Created by Bauyrzhan on 03.06.2021.
//

import Foundation
import UIKit

class ConfirmationCodeView: UIView {
    lazy var firstInputView : BottomBorderTF = {
        var text = BottomBorderTF()
        text.addTarget(self, action: #selector(self.textFieldDidChange(textField:)), for: .editingChanged)
        
        return text
    }()
    var onFourthInputViewChange : (()->())?
    
    lazy var secondInputView : BottomBorderTF = {
        var text = BottomBorderTF()
        text.addTarget(self, action: #selector(self.textFieldDidChange(textField:)), for: .editingChanged)
        
        return text
    }()
    lazy var thirdInputView : BottomBorderTF = {
        var text = BottomBorderTF()
        text.addTarget(self, action: #selector(self.textFieldDidChange(textField:)), for: .editingChanged)
        
        return text
    }()
    lazy var fourthInputView : BottomBorderTF = {
        var text = BottomBorderTF()
        text.addTarget(self, action: #selector(self.textFieldDidChange(textField:)), for: .editingChanged)
        text.delegate = self
        
        return text
    }()
    override init(frame: CGRect) {
        super.init(frame: .zero)
        backgroundColor = .clear
        setupViews()
        
    }
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    func setupViews(){
        addSubview(firstInputView)
            firstInputView.snp.makeConstraints { (make) in
                make.top.left.equalToSuperview()
                make.width.equalTo(60)
                make.height.equalTo(44)
            }
        addSubview(secondInputView)
            secondInputView.snp.makeConstraints { (make) in
                make.top.width.height.equalTo(firstInputView)
                make.left.equalTo(firstInputView.snp.right).offset(12)
            }
        addSubview(thirdInputView)
            thirdInputView.snp.makeConstraints { (make) in
                make.top.width.height.equalTo(firstInputView)
                make.left.equalTo(secondInputView.snp.right).offset(12)
            }
        addSubview(fourthInputView)
            fourthInputView.snp.makeConstraints { (make) in
                make.top.width.height.equalTo(firstInputView)
                make.right.equalToSuperview()
                make.left.equalTo(thirdInputView.snp.right).offset(12)
            }
    }
    @objc func textFieldDidChange(textField: UITextField) {
        let text = textField.text
        if text?.count == 1 {
            switch textField {
            case firstInputView:
                secondInputView.becomeFirstResponder()
            case secondInputView:
                thirdInputView.becomeFirstResponder()
            case thirdInputView:
                fourthInputView.becomeFirstResponder()
            case fourthInputView:
                fourthInputView.resignFirstResponder()
            default:
                break
            }
        }
        if text?.count == 0 {
            switch textField {
            case secondInputView:
                firstInputView.becomeFirstResponder()
            case thirdInputView:
                secondInputView.becomeFirstResponder()
            case fourthInputView:
                thirdInputView.becomeFirstResponder()
            default:
                break
            }
        }
    }
    
}


extension ConfirmationCodeView : UITextFieldDelegate {
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        onFourthInputViewChange?()
    }
    
}
