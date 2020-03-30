import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from  'react-icons/fi';

import './styles.css';
import logoImg from '../../assets/logo.svg'

import api from '../../services/api';

export default function Profile() {
    const [incidents, setIncidents] = useState([]);
    const history = useHistory();
    const ongId = localStorage.getItem('ongId');
    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ongId
            }
        }).then(response => {
            setIncidents(response.data);
        })
    }, [ongId]);

    function handleDeleteIncident(id) {
        try {
            api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId
                }
            });

            setIncidents(incidents.filter(incident => incident.id !== id ));
        } catch(e) {
            alert('Erro ao deletar. Tente novamente');
        }
    }

    async function handleLogout() {
        localStorage.clear();
        history.push('/');
    }

    const name = localStorage.getItem('ongName');
    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be the Hero"/>
                <span>Bem-vinda(o), {name}</span>
                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button
                onClick={() => handleLogout()}
                type="button">
                    <FiPower size={18} color="#e02041" />
                </button>
            </header>

            <h1>Casos cadastrados</h1>

            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>Caso:</strong>
                        <p>{incident.title}</p>

                        <strong>DESCRIÇÃO:</strong>
                        <p>{incident.description}</p>

                        <strong>VALOR:</strong>
                        <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(incident.value)}</p>

                        <button
                            type="button"
                            onClick={() => handleDeleteIncident(incident.id) }
                            >
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}