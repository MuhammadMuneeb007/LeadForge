import math, random, struct, wave
from pathlib import Path
SR=44100; DUR=35.0
OUT=Path("public/audio"); OUT.mkdir(parents=True,exist_ok=True)

def write(name,dur,fn):
    b=bytearray()
    for i in range(int(SR*dur)):
        t=i/SR
        x=max(-1,min(1,fn(t)))
        b+=struct.pack("<h",int(x*32767))
    with wave.open(str(OUT/name),"wb") as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(b)

notes=[110.0,164.81,196.0,146.83]
chords=[(220,277.18,329.63),(246.94,329.63,392),(196,246.94,329.63),(174.61,220,293.66)]
def music(t):
    bar=int(t/2)%4
    bass=.05*math.sin(2*math.pi*notes[bar]*t)
    pad=.043*sum(math.sin(2*math.pi*f*t) for f in chords[bar])/3
    beat=t%.5
    kick=.14*math.exp(-beat*22)*math.sin(2*math.pi*(66-20*min(beat/.14,1))*t) if beat<.14 else 0
    h=(t+.125)%.25
    hat=.010*math.exp(-h*120)*math.sin(2*math.pi*5100*t) if h<.017 else 0
    fi=min(1,t/.5); fo=min(1,max(0,(DUR-t)/1.2))
    return (bass+pad+kick+hat)*fi*fo
write("music.wav",DUR,music)
write("click.wav",.14,lambda t:.24*math.exp(-t*38)*(math.sin(2*math.pi*1250*t)+.3*math.sin(2*math.pi*2300*t)))
random.seed(17); noise=[random.uniform(-1,1) for _ in range(int(SR*.65))]
def whoosh(t):
    i=min(len(noise)-1,int(t*SR)); env=math.sin(math.pi*min(1,t/.65))**2
    return .11*env*noise[i]*math.sin(2*math.pi*(420+1500*t)*t)
write("whoosh.wav",.65,whoosh)
write("impact.wav",.45,lambda t:.24*math.exp(-t*9)*math.sin(2*math.pi*(92-22*t)*t))
print("Generated LeadForge audio assets.")
