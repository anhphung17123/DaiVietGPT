import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faLock, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useCharacters, useMockCharacters } from '../../hooks/useApi';
import { API_CONFIG } from '../../constants/config';
import './CharacterSelection.css';

const CharacterSelection = () => {
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const navigate = useNavigate();
    // Use mock characters for immediate display
    const { characters, loading, error } = useMockCharacters();

    useEffect(() => {
        if (characters && characters.length > 0 && !selectedCharacter) {
            setSelectedCharacter(characters[0]);
        }
    }, [characters, selectedCharacter]);


    const handleSelectCharacter = (id) => {
        navigate(`/chat/${id}`);
    };

    const handleShoppingCharacter = (id) => {
        navigate(`/payment/${id}`);
    };

    if (loading) {
        return (
            <div className="character-selection-loading">
                <div className="loading-spinner"></div>
                <p>Đang tải nhân vật...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="character-selection-error">
                <p>Có lỗi xảy ra khi tải nhân vật. Vui lòng thử lại.</p>
            </div>
        );
    }

    if (!characters || characters.length === 0) {
        return (
            <div className="character-selection-empty">
                <p>Không có nhân vật nào.</p>
            </div>
        );
    }

    return (
        <div className="characterSelection">
            {/* Background Images */}
            {characters.map((character) => (
                <img 
                    key={`bg-${character.id}`}
                    src={character.background}
                    className={`characterSelection-background ${
                        selectedCharacter?.name === character.name 
                            ? "characterSelection-background__selected" 
                            : ""
                    }`}
                    alt={`${character.name} background`}
                />
            ))}
            
            {/* Character Descriptions and Actions */}
            {characters.map((character) => (
                <div key={`content-${character.id}`}>
                    <div className={`characterSelection-description ${
                        selectedCharacter?.name === character.name 
                            ? "characterSelection-description__selected" 
                            : ""
                    }`}>
                        <p className="characterSelection-description-text">
                            {character.description}
                        </p>
                    </div>
                    
                    <div className={`characterSelection-action ${
                        selectedCharacter?.name === character.name 
                            ? "characterSelection-action--active" 
                            : ""
                    }`}>
                        <button 
                            className="characterSelection-action-button" 
                            onClick={() => 
                                character.isLocked === 0 
                                    ? handleSelectCharacter(character.id)
                                    : handleShoppingCharacter(character.id)
                            }
                            aria-label={
                                character.isLocked === 0 
                                    ? `Chọn ${character.name}` 
                                    : `Mua ${character.name}`
                            }
                        >
                            <FontAwesomeIcon 
                                icon={character.isLocked === 0 ? faArrowRight : faCartShopping} 
                            />
                        </button>
                    </div>
                </div>
            ))}
            
            {/* Sidebar */}
            <div className="characterSelection-sidebar">
                <h1 className="characterSelection-title">Chọn nhân vật</h1>
                <ul className="characterSelection-list">
                    {characters.map((character) => (
                        <li 
                            key={character.id}
                            className={`characterSelection-item ${
                                selectedCharacter?.name === character.name 
                                    ? "characterSelection-item__selected" 
                                    : ""
                            }`}
                            onClick={() => setSelectedCharacter(character)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setSelectedCharacter(character);
                                }
                            }}
                        >
                            <img 
                                className="characterSelection-item-img" 
                                src={character.background} 
                                alt={character.name} 
                            />
                            <span className="characterSelection-item-name">
                                {character.name}
                            </span>
                            {character.isLocked && (
                                <span className="characterSelection-item-locked">
                                    <FontAwesomeIcon 
                                        icon={faLock} 
                                        className="characterSelection-item-locked-icon" 
                                    />
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CharacterSelection;