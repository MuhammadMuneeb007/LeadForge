import React from "react";
import {AbsoluteFill,Audio,Img,Sequence,Easing,interpolate,spring,staticFile,useCurrentFrame,useVideoConfig} from "remotion";

const INK="#14251f";
const MUTED="#94a19b";
const PAPER="#f4f2eb";
const CARD="#fffefa";
const GREEN="#164d3c";
const GREEN2="#2d7258";
const LIME="#d9e9a6";
const ORANGE="#e4875b";
const clamp={extrapolateLeft:"clamp",extrapolateRight:"clamp"};

const Scene=({children})=><AbsoluteFill style={{background:INK,color:CARD,fontFamily:"Arial,Helvetica,sans-serif",overflow:"hidden"}}>
  <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 84% 10%,rgba(217,233,166,.17),transparent 34%),radial-gradient(circle at 8% 88%,rgba(45,114,88,.25),transparent 30%)"}}/>
  <div style={{position:"absolute",inset:0,opacity:.07,backgroundImage:"linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
  {children}
</AbsoluteFill>;

const Brand=()=> <div style={{display:"flex",alignItems:"center",gap:14,fontSize:31,fontWeight:900,letterSpacing:-1}}>
  <div style={{width:44,height:44,borderRadius:12,background:GREEN2,display:"grid",placeItems:"center",color:"#fff",fontSize:17,boxShadow:"0 12px 28px rgba(45,114,88,.35)"}}>LF</div>
  <span>LeadForge</span>
  <span style={{fontSize:12,letterSpacing:2,color:LIME,border:"1px solid rgba(217,233,166,.35)",padding:"6px 8px",borderRadius:7}}>OPEN SOURCE</span>
</div>;

const Kicker=({children})=><div style={{fontSize:23,fontWeight:900,letterSpacing:5,textTransform:"uppercase",color:LIME,marginBottom:18}}>{children}</div>;
const Head=({children,size=76})=><div style={{fontSize:size,fontWeight:950,lineHeight:.98,letterSpacing:-3.2}}>{children}</div>;
const Para=({children,w=650})=><div style={{fontSize:27,lineHeight:1.48,color:"#c8d0cc",maxWidth:w}}>{children}</div>;
const enter=(f,fps,d=0)=>spring({frame:f-d,fps,config:{damping:14,stiffness:135}});

const Browser=({src,width=1070,height=690,rotate=0,pos="top"})=>{
 const f=useCurrentFrame();
 const z=interpolate(f,[0,190],[1,1.025],{...clamp,easing:Easing.out(Easing.quad)});
 return <div style={{width,height,borderRadius:28,overflow:"hidden",background:CARD,border:"1px solid rgba(255,255,255,.15)",boxShadow:"0 45px 120px rgba(0,0,0,.45)",transform:`rotate(${rotate}deg) scale(${z})`}}>
   <div style={{height:50,background:"#e9eee9",display:"flex",alignItems:"center",padding:"0 18px",gap:9}}>
     <span style={{width:11,height:11,borderRadius:"50%",background:"#ff6b63"}}/>
     <span style={{width:11,height:11,borderRadius:"50%",background:"#f4bf4f"}}/>
     <span style={{width:11,height:11,borderRadius:"50%",background:"#60c75b"}}/>
     <div style={{marginLeft:12,height:28,borderRadius:15,background:"#fff",flex:1,color:"#64716b",fontSize:15,display:"flex",alignItems:"center",padding:"0 14px"}}>leadforge-umber.vercel.app</div>
   </div>
   <Img src={staticFile(src)} style={{width:"100%",height:"calc(100% - 50px)",objectFit:"cover",objectPosition:pos}}/>
 </div>
};

const Hook=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),p=enter(f,fps,2);
 return <Scene>
   <div style={{position:"absolute",top:58,left:76}}><Brand/></div>
   <div style={{position:"absolute",left:82,top:235,width:820,transform:`translateY(${(1-p)*38}px)`,opacity:interpolate(f,[0,18],[0,1],clamp)}}>
     <Kicker>Public business discovery</Kicker>
     <Head size={90}>Find local businesses.<br/>Build a list you can <span style={{color:LIME}}>actually use.</span></Head>
     <div style={{marginTop:30}}><Para w={760}>Turn open map data into a practical shortlist for research, outreach and market exploration.</Para></div>
     <div style={{display:"flex",gap:14,marginTop:36}}>
       {["No login","Local-first","Open source"].map(x=><div key={x} style={{padding:"14px 19px",borderRadius:15,background:"rgba(255,255,255,.075)",border:"1px solid rgba(255,255,255,.11)",fontSize:20,fontWeight:850}}>✓ {x}</div>)}
     </div>
   </div>
   <div style={{position:"absolute",right:-210,top:155,opacity:.20}}><Browser src="screens/home.png" width={1020} height={650} rotate={-2}/></div>
 </Scene>;
};

const Define=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),p=enter(f,fps,2);
 return <Scene>
   <div style={{position:"absolute",left:76,top:86,width:590}}>
     <Kicker>01 · Define the market</Kicker>
     <Head size={72}>City. Radius.<br/><span style={{color:LIME}}>Business types.</span></Head>
     <div style={{marginTop:26}}><Para w={560}>Choose a location, set the search radius, and combine up to three standard or custom business types.</Para></div>
     <div style={{marginTop:32,display:"grid",gap:12,width:510}}>
       {["Worldwide city selection","1–50 km radius","Standard + custom categories"].map((x,i)=><div key={x} style={{padding:"15px 18px",borderRadius:15,background:i===1?"rgba(217,233,166,.11)":"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.11)",fontSize:20,fontWeight:850}}>✓ {x}</div>)}
     </div>
   </div>
   <div style={{position:"absolute",right:70,top:125,transform:`translateY(${(1-p)*30}px)`}}><Browser src="screens/workspace.png" width={1140} height={775}/></div>
 </Scene>;
};

const Results=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),p=enter(f,fps,2);
 return <Scene>
   <div style={{position:"absolute",left:76,top:75,right:76}}>
     <Kicker>02 · Review the results</Kicker>
     <Head size={69}>List + map, in one workspace.</Head>
     <div style={{marginTop:20}}><Para w={760}>Inspect the businesses, compare distance and data completeness, filter the list and focus any location on the map.</Para></div>
   </div>
   <div style={{position:"absolute",left:100,top:360,transform:`translateY(${(1-p)*30}px)`}}><Browser src="screens/results.png" width={1720} height={650}/></div>
   <div style={{position:"absolute",right:95,bottom:42,display:"flex",gap:12}}>
    {["Filter","Sort","List","Map"].map(x=><div key={x} style={{padding:"12px 16px",borderRadius:12,background:GREEN2,fontSize:17,fontWeight:900}}>{x}</div>)}
   </div>
 </Scene>;
};

const Shortlist=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),p=enter(f,fps,2);
 return <Scene>
   <div style={{position:"absolute",left:76,top:78,width:650}}>
     <Kicker>03 · Build the shortlist</Kicker>
     <Head size={70}>Keep the businesses<br/><span style={{color:LIME}}>that matter.</span></Head>
     <div style={{marginTop:24}}><Para w={630}>Select useful records, save them locally in your browser, and optionally scan linked public websites for contact details.</Para></div>
     <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13,marginTop:32,width:640}}>
       {[
        ["Saved locally","No cloud account required"],
        ["Public contacts","On-request website scan"],
        ["Recent searches","Stored in your browser"],
        ["Responsible use","Verify before outreach"],
       ].map(([a,b])=><div key={a} style={{padding:"20px",borderRadius:18,background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.11)"}}>
         <div style={{fontSize:23,fontWeight:950,color:LIME}}>{a}</div><div style={{fontSize:17,color:"#b9c4bf",marginTop:6,lineHeight:1.35}}>{b}</div>
       </div>)}
     </div>
   </div>
   <div style={{position:"absolute",right:80,top:135,transform:`translateY(${(1-p)*30}px)`}}><Browser src="screens/selected.png" width={1110} height={765} rotate={1}/></div>
 </Scene>;
};

const ExportScene=()=>{
 const f=useCurrentFrame();
 return <Scene>
   <div style={{position:"absolute",left:80,top:92,width:710}}>
     <Kicker>04 · Export what you need</Kicker>
     <Head size={73}>From shortlist<br/>to usable data.</Head>
     <div style={{marginTop:25}}><Para w={650}>Export the full filtered list, only selected businesses, or focused contact subsets — without locking your data into the app.</Para></div>
     <div style={{display:"flex",gap:14,marginTop:34,flexWrap:"wrap",width:690}}>
      {["CSV","Selected CSV","Phone list","Email list","GeoJSON"].map((x,i)=> <div key={x} style={{padding:"15px 19px",borderRadius:14,background:i===0?ORANGE:"rgba(255,255,255,.075)",border:i===0?"none":"1px solid rgba(255,255,255,.11)",fontSize:20,fontWeight:900}}>{x}</div>)}
     </div>
   </div>
   <div style={{position:"absolute",right:80,top:140}}><Browser src="screens/selected.png" width={1120} height={760} rotate={-1}/></div>
   <div style={{position:"absolute",right:260,bottom:80,padding:"16px 22px",borderRadius:16,background:GREEN2,boxShadow:"0 18px 44px rgba(0,0,0,.3)",fontSize:21,fontWeight:950}}>Export all → CSV</div>
 </Scene>;
};

const Trust=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),p=enter(f,fps,2);
 return <Scene>
  <div style={{position:"absolute",left:80,top:110,width:780}}>
    <Kicker>Built differently</Kicker>
    <Head size={80}>Useful workflow.<br/><span style={{color:LIME}}>Transparent data.</span></Head>
    <div style={{marginTop:28}}><Para w={720}>LeadForge uses public OpenStreetMap data, keeps saved lists locally, and does not infer buying intent. You stay in control of what you verify, keep and export.</Para></div>
  </div>
  <div style={{position:"absolute",right:115,top:140,width:700,display:"grid",gap:18}}>
   {[
    ["No account","Start searching without signing up."],
    ["Open data","Business discovery from public geographic data."],
    ["Local-first","Saved lists and search history stay in your browser."],
    ["Open source","Inspect the code and methodology yourself."]
   ].map(([a,b],i)=><div key={a} style={{padding:"24px 28px",borderRadius:22,background:"rgba(255,255,255,.075)",border:"1px solid rgba(255,255,255,.11)",transform:`translateX(${(1-p)*(55+i*10)}px)`}}>
     <div style={{fontSize:27,fontWeight:950,color:LIME}}>{a}</div><div style={{fontSize:20,color:"#b9c4bf",marginTop:6,lineHeight:1.35}}>{b}</div>
   </div>)}
  </div>
 </Scene>;
};

const CTA=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),p=enter(f,fps,1),pulse=1+.014*Math.sin(f/6);
 return <Scene>
  <div style={{position:"absolute",top:100,left:0,right:0,display:"flex",justifyContent:"center"}}><Brand/></div>
  <div style={{position:"absolute",left:0,right:0,top:310,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",transform:`translateY(${(1-p)*30}px)`}}>
    <Kicker>Build your shortlist</Kicker>
    <Head size={88}>Search. Review.<br/><span style={{color:LIME}}>Export.</span></Head>
    <div style={{fontSize:27,color:"#c7d0cb",marginTop:27}}>Start with public business data and keep the records worth using.</div>
    <div style={{marginTop:45,padding:"22px 38px",borderRadius:19,background:GREEN2,boxShadow:"0 24px 70px rgba(45,114,88,.34)",fontSize:27,fontWeight:950,transform:`scale(${pulse})`}}>leadforge-umber.vercel.app</div>
    <div style={{fontSize:18,color:"#8fa09a",marginTop:24}}>Open source • No login • Public-data discovery</div>
  </div>
 </Scene>;
};

export const LeadForgePromo=()=> <AbsoluteFill style={{background:INK}}>
 <Audio src={staticFile("audio/music.wav")} volume={0.14}/>
 <Audio src={staticFile("audio/voice.mp3")} volume={1}/>
 <Sequence from={0} durationInFrames={120}><Hook/></Sequence>
 <Sequence from={120} durationInFrames={180}><Define/></Sequence>
 <Sequence from={300} durationInFrames={210}><Results/></Sequence>
 <Sequence from={510} durationInFrames={210}><Shortlist/></Sequence>
 <Sequence from={720} durationInFrames={150}><ExportScene/></Sequence>
 <Sequence from={870} durationInFrames={105}><Trust/></Sequence>
 <Sequence from={975} durationInFrames={75}><CTA/></Sequence>

 <Sequence from={120} durationInFrames={22}><Audio src={staticFile("audio/whoosh.wav")} volume={0.44}/></Sequence>
 <Sequence from={300} durationInFrames={22}><Audio src={staticFile("audio/whoosh.wav")} volume={0.46}/></Sequence>
 <Sequence from={510} durationInFrames={12}><Audio src={staticFile("audio/click.wav")} volume={0.58}/></Sequence>
 <Sequence from={720} durationInFrames={22}><Audio src={staticFile("audio/whoosh.wav")} volume={0.44}/></Sequence>
 <Sequence from={870} durationInFrames={16}><Audio src={staticFile("audio/impact.wav")} volume={0.34}/></Sequence>
 <Sequence from={975} durationInFrames={16}><Audio src={staticFile("audio/impact.wav")} volume={0.44}/></Sequence>
</AbsoluteFill>;
