import React from 'react';
import { useHistory } from 'react-router-dom'; // Asume que estás usando react-router-dom para la navegación

export default function House({ house }) {
    const history = useHistory();

    const handleClick = () => {
        history.push(`/houses/${house.id}`); // Redirige al usuario a una nueva página que muestra más detalles sobre la casa
    };

    return (
        <div onClick={handleClick}>
            {/* Inserta aquí la información de la casa que quieres mostrar */}
        </div>
    );
}