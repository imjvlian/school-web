export default function SectionHeading({eyebrow,title,centered=false}) { return <div className={`section-heading ${centered?'centered':''}`}>{eyebrow&&<span>{eyebrow}</span>}<h2>{title}</h2></div> }
