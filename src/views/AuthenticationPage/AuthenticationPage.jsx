import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useAuth } from "../../hooks/useApi";
import { FORM_TYPES } from "../../constants/config";
import { validatePassword, isValidEmail } from "../../utils/helpers";
import './AuthenticationPage.css';

const AuthenticationPage = () => {
    const navigate = useNavigate();
    const { setIsShowAuthModal, setProfileInfo } = useUser();
    const { login, loading } = useAuth();

    const [isShowing, setIsShowing] = useState(false);
    const [type, setType] = useState(FORM_TYPES.LOGIN);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        rePassword: ""
    });

    useEffect(() => {
        setIsShowing(true);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Tên người dùng là bắt buộc";
        }

        if (!formData.password) {
            newErrors.password = "Mật khẩu là bắt buộc";
        } else {
            const passwordValidation = validatePassword(formData.password);
            if (!passwordValidation.isValid) {
                newErrors.password = passwordValidation.message;
            }
        }

        if (type === FORM_TYPES.REGISTER) {
            if (!formData.rePassword) {
                newErrors.rePassword = "Vui lòng nhập lại mật khẩu";
            } else if (formData.password !== formData.rePassword) {
                newErrors.rePassword = "Mật khẩu không khớp";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        const result = await login({
            username: formData.username,
            password: formData.password
        });

        if (result.success) {
            setIsShowAuthModal(false);
            setProfileInfo();
            navigate("/");
        } else {
            setErrors({ general: result.error.message || "Đăng nhập thất bại" });
        }
    };

    const handleSubmitRegister = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        // TODO: Implement register functionality
        alert("Chức năng đăng ký đang được phát triển");
    };

    const switchFormType = (newType) => {
        setType(newType);
        setFormData({ username: "", password: "", rePassword: "" });
        setErrors({});
    };

    return (
        <div className="authentication-form-container">
            <div
                className="authentication-form__opacity"
                onClick={() => setIsShowAuthModal(false)}
            ></div>
            <div className={`authentication-form__outer ${isShowing ? "isShowing" : ""}`}>
                {type === FORM_TYPES.LOGIN ? (
                    <form className="authentication-form" onSubmit={handleSubmitLogin}>
                        <div className="authentication-form__title">
                            <h1>Đăng nhập</h1>
                        </div>
                        
                        {errors.general && (
                            <div className="error-message general-error">
                                {errors.general}
                            </div>
                        )}
                        
                        <div className="authentication-form__input">
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Tên người dùng"
                                    className={errors.username ? "error" : ""}
                                />
                                {errors.username && (
                                    <span className="error-message">{errors.username}</span>
                                )}
                            </div>
                            
                            <div className="input-group">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Mật khẩu"
                                    className={errors.password ? "error" : ""}
                                />
                                {errors.password && (
                                    <span className="error-message">{errors.password}</span>
                                )}
                            </div>
                        </div>
                        
                        <div className="authentication-form__btn-forgotPass">
                            <button type="button">Quên mật khẩu?</button>
                        </div>
                        
                        <button
                            type="submit"
                            className="authentication-form__button"
                            disabled={loading}
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                        
                        <div className="authentication-form__action">
                            <span>Chưa có tài khoản?</span>
                            <button
                                type="button"
                                onClick={() => switchFormType(FORM_TYPES.REGISTER)}
                            >
                                Đăng ký
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="authentication-form" onSubmit={handleSubmitRegister}>
                        <div className="authentication-form__title">
                            <h1>Đăng ký</h1>
                        </div>
                        
                        {errors.general && (
                            <div className="error-message general-error">
                                {errors.general}
                            </div>
                        )}
                        
                        <div className="authentication-form__input">
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Tên người dùng"
                                    className={errors.username ? "error" : ""}
                                />
                                {errors.username && (
                                    <span className="error-message">{errors.username}</span>
                                )}
                            </div>
                            
                            <div className="input-group">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Mật khẩu"
                                    className={errors.password ? "error" : ""}
                                />
                                {errors.password && (
                                    <span className="error-message">{errors.password}</span>
                                )}
                            </div>
                            
                            <div className="input-group">
                                <input
                                    type="password"
                                    name="rePassword"
                                    value={formData.rePassword}
                                    onChange={handleInputChange}
                                    placeholder="Nhập lại mật khẩu"
                                    className={errors.rePassword ? "error" : ""}
                                />
                                {errors.rePassword && (
                                    <span className="error-message">{errors.rePassword}</span>
                                )}
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            className="authentication-form__button"
                            disabled={loading}
                        >
                            {loading ? "Đang đăng ký..." : "Đăng ký"}
                        </button>
                        
                        <div className="authentication-form__action">
                            <span>Đã có tài khoản?</span>
                            <button
                                type="button"
                                onClick={() => switchFormType(FORM_TYPES.LOGIN)}
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthenticationPage;