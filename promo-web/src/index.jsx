import React from "react";
import {Composition,registerRoot} from "remotion";
import {LeadForgePromo} from "./Promo";
const Root=()=> <Composition id="LeadForgePromo" component={LeadForgePromo} durationInFrames={1050} fps={30} width={1920} height={1080}/>;
registerRoot(Root);
