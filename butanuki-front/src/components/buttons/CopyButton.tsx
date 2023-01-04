import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

export const CopyButton = ({
  value,
  text,
  feedback,
}: {
  value: string;
  text: string;
  feedback: string;
}) => {
  const [show, setShow] = useState(false);
  const target = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        setShow(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [show]);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setShow(true);
  }, [value]);

  return (
    <InputGroup className="mb-3">
      <FormControl disabled value={value} />
      <Button ref={target} onClick={copy} variant={"secondary"}>
        {text}
      </Button>
      <Overlay target={target.current} show={show} placement="right">
        {(props) => (
          <Tooltip id={id} {...props}>
            {feedback}
          </Tooltip>
        )}
      </Overlay>
    </InputGroup>
  );
};
