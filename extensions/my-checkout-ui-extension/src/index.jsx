// import '@shopify/ui-extensions/preact';
// import {render} from "preact";

// // 1. Export the extension
// export default async () => {
//   render(<Extension />, document.body)
// };

// function Extension() {
//   // 2. Check instructions for feature availability, see https://shopify.dev/docs/api/checkout-ui-extensions/apis/cart-instructions for details
//   if (!shopify.instructions.value.attributes.canUpdateAttributes) {
//     // For checkouts such as draft order invoices, cart attributes may not be allowed
//     // Consider rendering a fallback UI or nothing at all, if the feature is unavailable
//     return (
//       <s-banner heading="my-checkout-ui-extension" tone="warning">
//         {shopify.i18n.translate("attributeChangesAreNotSupported")}
//       </s-banner>
//     );
//   }

//   // 3. Render a UI
//   return (
//     <s-banner heading="my-checkout-ui-extension">
//       <s-text>heading</s-text>
//       <s-stack gap="base">
//         <s-text>
//           {shopify.i18n.translate("welcome", {
//             target: <s-text type="emphasis">{shopify.extension.target}</s-text>,
//           })}
//         </s-text>
//         <s-button onClick={handleClick}>
//           {shopify.i18n.translate("addAFreeGiftToMyOrder")}
//         </s-button>
//       </s-stack>
//     </s-banner>
//   );

//   async function handleClick() {
//     // 4. Call the API to modify checkout
//     const result = await shopify.applyAttributeChange({
//       key: "requestedFreeGift",
//       type: "updateAttribute",
//       value: "yes",
//     });
//     console.log("applyAttributeChange result", result);
//   }
// }

import "@shopify/ui-extensions/preact";
import { render } from "preact";
import { useState } from "preact/hooks";

export default async () => {
  render(<GiftCardExtension />, document.body);
};

function GiftCardExtension() {
  // ✅ only use APIs that your types know about
  const { applyDiscountCodeChange, i18n } = shopify;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("info"); // "info" | "success" | "critical"

  async function handleApply() {
 console.log("code-val", code)
    setMessage("");
    setTone("info");

    if (!code.trim()) {
      setMessage("Please enter a gift card or coupon code.");
      setTone("critical");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ validate with your own API
      const resp = await fetch("https://mywork-ksiusbac2-gilllucky95-7457s-projects.vercel.app/validate-gift-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!resp.ok) {
        throw new Error(`API error ${resp.status}`);
      }

      const data = await resp.json();

      if (!data.valid) {
        setMessage(data.message || "Invalid or expired gift card.");
        setTone("critical");
        setLoading(false);
        return;
      }

      // 2️⃣ apply discount in checkout
      const result = await applyDiscountCodeChange({
        type: "addDiscountCode",
        code: data.discountCode || code, // must exist as a Shopify discount
      });

      if (result.type === "error") {
        setMessage(result.message || "Could not apply this code.");
        setTone("critical");
      } else {
        setMessage(data.message || "Gift card applied successfully 🎉");
        setTone("success");
        setCode("");
      }
    } catch (err) {
      console.error("Gift card validation error:", err);
      setMessage("Something went wrong validating this code.");
      setTone("critical");
    } finally {
      setLoading(false);
    }

      // await applyDiscountCodeChange({
      //   type: "addDiscountCode",
      //   code: `SAVE100`, // must exist as a Shopify discount
      // });
  }

  function handleData(e){
setCode(e.target.value)
  }
     
  return (
    <s-box padding="base" border="base" >
      <s-stack gap="base">
        <s-heading>Epay gift card redeem</s-heading>

        <s-text-field
          label="Enter gift card or coupon code"
          value={code}
          onInput={handleData}
        />

        <s-button onClick={handleApply} loading={loading}>
          Apply code
        </s-button>

        {message && <s-banner tone="auto">{message}</s-banner>}
      </s-stack>
    </s-box>
  );
}
