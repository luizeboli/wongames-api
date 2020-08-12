/**
 *
 * LeftMenuFooter
 *
 */

import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";

import Wrapper from "./Wrapper";
import messages from "./messages.json";

defineMessages(messages);

function LeftMenuFooter() {
  return (
    <Wrapper>
      <div className="poweredBy">
        <FormattedMessage
          id={messages.poweredBy.id}
          defaultMessage={messages.poweredBy.defaultMessage}
          key="poweredBy"
        />
        <a
          key="website"
          href="https://luizfelicio.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Luiz Felicio
        </a>
      </div>
    </Wrapper>
  );
}

export default LeftMenuFooter;
