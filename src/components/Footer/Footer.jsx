import PuzzleStrip from "../PuzzleStrip/PuzzleStrip";

function Footer() {
    return (
        <>
            <PuzzleStrip />
            <footer className="page-footer">
                <span className="security">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                    Seus dados estão protegidos conosco.
                </span>

                <span className="footer-divider" />
                <a href="#politica-de-privacidade">Política de Privacidade</a>
                <a href="#termos-de-uso">Termos de Uso</a>
            </footer>
        </>
    )
}

export default Footer;