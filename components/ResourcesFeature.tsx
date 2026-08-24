import { Reveal } from "./Reveal";

const RESOURCES_URL = "https://tfh-resources-admin-k2ii.vercel.app";

export function ResourcesFeature() {
  return (
    <section className="resources-feature" id="resources">
      <div className="container resources-feature__inner">

        <div className="resources-feature__copy">
          <Reveal>
            <p className="eyebrow">TFH Resources</p>

            <h2>
              French resources,<br />
              <em>built for progress.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="resources-feature__text">
              Guides, practice kits and exam-focused material designed
              to make your French learning more structured, focused
              and intentional.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <a
              href={RESOURCES_URL}
              className="button button--dark resources-feature__button"
            >
              Explore resources
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="resources-feature__visual" aria-hidden="true">
            <div className="resources-feature__paper resources-feature__paper--one">
              <span>TEF</span>
              <strong>Écrire<br />avec structure.</strong>
              <small>THE FRANÇAIS HUB</small>
            </div>

            <div className="resources-feature__paper resources-feature__paper--two">
              <span>VOCABULAIRE</span>
              <strong>Learn.<br />Use. Retain.</strong>
              <small>THE FRANÇAIS HUB</small>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
