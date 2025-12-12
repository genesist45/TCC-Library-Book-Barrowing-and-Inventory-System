import { useState, useEffect } from "react";
import axios from "axios";

interface MemberValidation {
    isValid: boolean | null;
    isChecking: boolean;
    message: string;
}

export function useMemberValidation(memberId: string) {
    const [validation, setValidation] = useState<MemberValidation>({
        isValid: null,
        isChecking: false,
        message: "",
    });

    useEffect(() => {
        if (memberId) {
            setValidation({ isValid: null, isChecking: true, message: "Checking..." });

            const timer = setTimeout(() => {
                axios
                    .get(`/api/members/${memberId}`)
                    .then(() => {
                        setValidation({
                            isValid: true,
                            isChecking: false,
                            message: "Valid member number",
                        });
                    })
                    .catch(() => {
                        setValidation({
                            isValid: false,
                            isChecking: false,
                            message: "Member number does not exist",
                        });
                    });
            }, 500);

            return () => clearTimeout(timer);
        } else {
            setValidation({ isValid: null, isChecking: false, message: "" });
        }
    }, [memberId]);

    const getValidationState = (): "valid" | "invalid" | "checking" | null => {
        if (validation.isChecking) return "checking";
        if (validation.isValid === true) return "valid";
        if (validation.isValid === false) return "invalid";
        return null;
    };

    return {
        ...validation,
        validationState: getValidationState(),
    };
}
