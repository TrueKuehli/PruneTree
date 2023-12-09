import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.scss'
import plumbob from './plumbob.png'
import thumbsup from './thumbsup.png'
import lifering from './lifering.png'

export default () => {
  return (
    <div>
      <div className={styles.homeBannerImage} />
      <div className='container'>
        <div className={styles.introPanel}>
          <p className={styles.alert}>This fork is still in its very early stages. There may still be bugs and not all features may work as expected. If you notice any issues, feel free to open up an issue on the <Link to={'TODO'}>GitHub</Link> page for this project.</p>
          <p>Welcome to the Prune Tree app!</p>
          <p>Create dynamic family trees for your sims legacies.</p>
          <p>A <Link to='https://en.wikipedia.org/wiki/Fork_(software_development)'>fork</Link> of the <Link to='https://gitlab.com/plum-tree'>Plum Tree</Link> app, based on the original source code and available on <Link to='https://github.com/TrueKuehli/PruneTree'>GitHub</Link>.</p>
          <p>This fork was created after the shutdown of the website hosting the original app. The goal of this fork is to provide a way to track family trees to the Sims community that looks and feels familiar, yet does not require a server for storing and managing trees.</p>
          <p>As a consequence of now storing trees locally, there currently is no way to share trees with other people. This will be somewhat improved by better download options in a future version.</p>
          <p>If you have any feedback or suggestions, feel free to use the <Link to='https://github.com/TrueKuehli/PruneTree/issues'>GitHub Issue Tracker</Link>!</p>
        </div>
        <div className='row'>
          <div className='col-12 col-md-4'>
            <img src={plumbob} className={styles.featureImage} width='100' alt='Plumbob'/>
            <p>Crafted with Sims in mind we allow to set traits, aspirations and
              other Sims specific details to really help convey your sims colourful
              lives.
            </p>
          </div>
          <div className='col-12 col-md-4'>
            <img src={thumbsup} className={styles.featureImage} width='100' alt='Thumbs Up'/>
            <p>Built to be simple yet flexible so you can easily build and share
              your sims legacy.
            </p>
          </div>
          <div className='col-12 col-md-4'>
            <img src={lifering} className={styles.featureImage} width='100' alt='Lifering'/>
            <p>Need help or have a question? Check out <Link to='/guides'>our guides</Link>.</p>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <h2>Using The Prune Tree</h2>
            <p>If our guides don't do it for you, check out <a href='https://www.youtube.com/channel/UCYorr-o7j29k9vF8xGiiCmA' target='_blank' rel='noopener noreferrer'>The SimTwins</a> video instead. We thank them for this brilliant guide they put together on how to build the perfect Sims 4 family tree.</p>
            <p>Since the guide was created for the Plum Tree app, some features shown in the video may be missing.</p>
            <div className={styles.guideVideo}>
              <iframe width='560' height='315' src='https://www.youtube.com/embed/QatRM3knISY' frameBorder='0' allowFullScreen />
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-12 col-md-6'>
            <h2>Guides</h2>
            <Link className={styles.guidesImage} to='/guides' />
            <p>Get up to speed with how to use The Prune Tree with our guides.</p>
            <Link className='btn btn-primary' to='/guides'>Read The Guides</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
