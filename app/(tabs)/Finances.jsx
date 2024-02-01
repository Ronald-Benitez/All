import FinancesBlock from "@/src/components/finances/FinancesBlock";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";


const Finances = () => {
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  if (!isFocused) return null;

  return (
    <>
      <FinancesBlock savingsFlag={false} />
    </>
  );
};

export default Finances;
