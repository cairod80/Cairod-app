# Phase B hotfix 1: onboarding screen must scroll inside the fixed-height app shell.
# usage: python3 phase_b_fix1_onboarding_scroll.py IN.jsx OUT.jsx
import sys
c=open(sys.argv[1],encoding='utf-8').read()
def rep(old,new,label):
    global c
    assert c.count(old)==1, f"expected 1 match for {label}, found {c.count(old)}"
    c=c.replace(old,new,1)
# Scrollable full-screen container (same approach as the Login/Signup 'auth-scroll' area)
rep('<div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",flexDirection:"column",padding:"0 0 32px"}}>',
    '<div style={{position:"absolute",inset:0,overflowY:"auto",overflowX:"hidden",WebkitOverflowScrolling:"touch",background:"var(--bg)",display:"flex",flexDirection:"column",padding:"0 0 calc(32px + env(safe-area-inset-bottom))"}}>',
    "onboarding root")
# Header padding must clear the status bar; logo was near-invisible on the cream background
rep('<div style={{padding:"52px 20px 20px",textAlign:"center"}}>',
    '<div style={{padding:"calc(36px + env(safe-area-inset-top)) 20px 20px",textAlign:"center"}}>',"onboarding header")
rep('<div style={{fontFamily:"\'Fraunces\',serif",fontSize:13,fontWeight:900,color:"rgba(255,255,255,0.2)",marginBottom:16}}>',
    '<div style={{fontFamily:"\'Fraunces\',serif",fontSize:14,fontWeight:900,color:"var(--sub)",marginBottom:16}}>',"onboarding logo")
rep('const XAIROD_BUILD="v14.5 · 2 Nov 2026";','const XAIROD_BUILD="v14.6 · 2 Nov 2026";',"stamp")
open(sys.argv[2],'w',encoding='utf-8').write(c)
print("fix1 OK")
