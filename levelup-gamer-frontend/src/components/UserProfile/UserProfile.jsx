import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ReferralCode from "../ReferralCode/ReferralCode";

const UserProfile = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div
      className="profile-container"
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      <Card className="bg-dark text-white mb-4">
        <Card.Body>
          <h3 className="mb-4">Mi Perfil</h3>

          <div className="mb-3">
            <strong>Nombre:</strong>
            <p className="text-secondary">{user.name}</p>
          </div>

          <div className="mb-3">
            <strong>Email:</strong>
            <p className="text-secondary">{user.email}</p>
          </div>

          {user.email.toLowerCase().endsWith("@duocuc.cl") && (
            <div className="alert alert-success">
              <strong>¡Descuento DuocUC Activo!</strong>
              <p className="mb-0">
                Tienes un 20% de descuento en todas tus compras
              </p>
            </div>
          )}

          <Button variant="outline-danger" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Card.Body>
      </Card>

      <ReferralCode code={user.referralCode} />
    </div>
  );
};

export default UserProfile;
