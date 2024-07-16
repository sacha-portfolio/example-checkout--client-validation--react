import {
  reactExtension,
  useBuyerJourneyIntercept,
  useShippingAddress,
  useNote,
} from "@shopify/ui-extensions-react/checkout";
import React, { useEffect, useState } from "react";

export default reactExtension("purchase.checkout.block.render", () => <App />);

function App() {
  const address = useShippingAddress();
  const orderNote = useNote();
  const [blockProgress, setBlockProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (address?.countryCode === 'FR' && orderNote !== 'DRAFT ORDER VIP') {
      setBlockProgress(true);
      setErrorMessage('To ship to France go to our dedicated French website - fr.bruichladdich.com');
    } else if (address?.countryCode === 'DE' && orderNote !== 'DRAFT ORDER VIP') {
      setBlockProgress(true);
      setErrorMessage('To ship to Germany got to our dedicated German website - de.bruichladdich.com');
    } else {
      setBlockProgress(false);
      setErrorMessage('');
    }
  }, [address, orderNote]);

  useBuyerJourneyIntercept(
    ({canBlockProgress}) => {
      if (canBlockProgress && blockProgress) {
        return {
          behavior: 'block',
          reason: 'Invalid shipping country',
          errors: [
            {
              message: errorMessage,
              target: '$.cart.deliveryGroups[0].deliveryAddress.countryCode',
            },
          ],
        };
      }

      return {
        behavior: 'allow',
      };
    },
  );

  return null;
}