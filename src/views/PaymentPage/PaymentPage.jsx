import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faCreditCard, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useCharacter } from "../../hooks/useApi";
import { PAYMENT_METHODS } from "../../constants/config";
import { formatPrice } from "../../utils/helpers";
import './PaymentPage.css';

const PaymentPage = () => {
    const { id } = useParams();
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const { character, loading, error } = useCharacter(id);

    const handlePayment = async () => {
        if (!paymentMethod) {
            alert('Vui lòng chọn phương thức thanh toán');
            return;
        }

        setIsProcessing(true);
        
        try {
            // TODO: Implement payment processing
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate payment
            alert('Thanh toán thành công!');
        } catch (error) {
            console.error('Payment error:', error);
            alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="payment-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải thông tin thanh toán...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="payment-error">
                <p>Có lỗi xảy ra khi tải thông tin. Vui lòng thử lại.</p>
            </div>
        );
    }

    if (!character) {
        return (
            <div className="payment-error">
                <p>Không tìm thấy nhân vật.</p>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="payment-page-container">
                <Link to="/" className="back-link">
                    <div className="payment-page__header">
                        <div className="payment-page__header__back">
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                        <span className="payment-page__header__title">Quay lại Trang chủ</span>
                    </div>
                </Link>
                
                <div className="payment-page__row">
                    <div className="payment-page-row__info-character">
                        <div className="payment-page__info-character__img">
                            <img src={`${character.avatar}`} alt={character.name} />
                        </div>
                        <div className="payment-page__info-character__name">
                            {character.name}
                        </div>
                    </div>
                    <div className="payment-page-row__line-separate"></div>
                    <div className="payment-page-row__price">
                        Giá: {formatPrice(character.price)}
                    </div>
                </div>
                
                <div className="payment-page__content">
                    <div className="payment-page__content__title">
                        <FontAwesomeIcon icon={faCreditCard} />
                        Chọn phương thức thanh toán
                    </div>
                    
                    <div className="payment-page__content__methods">
                        {PAYMENT_METHODS.map(method => (
                            <div 
                                key={method.id} 
                                className={`payment-page__content__methods__item ${
                                    paymentMethod === method.id ? "active" : ""
                                }`}
                                onClick={() => setPaymentMethod(method.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setPaymentMethod(method.id);
                                    }
                                }}
                            >
                                <img src={method.img} alt={method.name} />
                                {paymentMethod === method.id && (
                                    <div className="payment-method-check">
                                        <FontAwesomeIcon icon={faCheck} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className="payment-page__actions">
                        <button 
                            className="payment-button"
                            onClick={handlePayment}
                            disabled={!paymentMethod || isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="loading-spinner small"></div>
                                    Đang xử lý...
                                </>
                            ) : (
                                `Thanh toán ${formatPrice(character.price)}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;