/**
 *
 * LeftMenuFooter
 *
 */

import React from "react";

import Wrapper from "./Wrapper";

function LeftMenuFooter() {
  return (
    <Wrapper>
      <div className="poweredBy">
        <span>Mantido por</span>
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
