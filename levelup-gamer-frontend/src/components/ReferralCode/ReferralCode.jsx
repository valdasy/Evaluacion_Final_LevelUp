import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";

const ReferralCode = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-dark text-white">
      <Card.Body>
        <h4 className="mb-3">Tu Código de Referido</h4>
        <p className="text-secondary">
          Comparte este código y gana recompensas
        </p>

        <div className="d-flex align-items-center gap-3">
          <div className="referral-code-display flex-grow-1">
            <code className="fs-4 text-success">{code}</code>
          </div>
          <Button variant="outline-success" onClick={handleCopy}>
            {copied ? "✓ Copiado" : "Copiar"}
          </Button>
        </div>

        {copied && (
          <Alert variant="success" className="mt-3 mb-0">
            ¡Código copiado al portapapeles!
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReferralCode;
