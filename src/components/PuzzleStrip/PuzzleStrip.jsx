import "./PuzzleStrip.css";

function PuzzleStrip() {
    return (
        <div className="puzzle-strip" aria-hidden="true">
                    {[
                        "blue",
                        "purple",
                        "yellow",
                        "green",
                        "blue",
                        "red",
                        "purple",
                        "green",
                        "yellow",
                        "blue",
                        "green",
                        "red",
                        "purple",
                        "blue",
                        "green",
                        "yellow",
                        "blue",
                        "red",
                    ].map((color, index) => (
                        <span className={color} key={`${color}-${index}`} />
                    ))}
                </div>
    )
}

export default PuzzleStrip