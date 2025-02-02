import $ from 'lib/$';
import config from 'lib/config';
import { isBreakpoint } from 'lib/detect';
import { mediator } from 'lib/mediator';
import { catchErrorsWithContext } from 'lib/robust';
import { shouldHideFlashingElements } from 'common/modules/accessibility/helpers';
import stocks from 'common/modules/business/stocks';
import { GeoMostPopularFront } from 'facia/modules/onwards/geo-most-popular-front';
import { GeoMostPopularFrontExtended } from 'facia/modules/onwards/geo-most-popular-front-extended';
import { ContainerToggle } from 'facia/modules/ui/container-toggle';
import { init as initShowMore } from 'facia/modules/ui/container-show-more';
import { lazyLoadContainers } from 'facia/modules/ui/lazy-load-containers';
import { showUpdatesFromLiveBlog } from 'facia/modules/ui/live-blog-updates';
import { init as initSnaps } from 'facia/modules/ui/snaps';
import { init as initRegionSelector } from 'facia/modules/ui/au-region-selector'
import { Weather } from 'facia/modules/onwards/weather';
import partial from 'lodash/partial';
import { videoContainerInit } from 'common/modules/video/video-container';
import { addContributionsBanner } from 'journalism/modules/audio-series-add-contributions';

const showSnaps = () => {
    initSnaps();
    mediator.on('modules:container:rendered', initSnaps);
};

const showContainerShowMore = () => {
    mediator.addListeners({
        'modules:container:rendered': initShowMore,
        'page:front:ready': initShowMore,
    });
};

const showContainerToggle = () => {
    const containerToggleAdd = context => {
        $('.js-container--toggle', $(context || document)[0]).each(
            container => {
                const toggle = new ContainerToggle(container);
                toggle.addToggle();
            }
        );
    };
    mediator.addListeners({
        'page:front:ready': containerToggleAdd,
        'modules:geomostpopular:ready': partial(
            containerToggleAdd,
            '.js-popular-trails'
        ),
    });
};

const upgradeMostPopularToGeo = () => {
    if (config.get('switches.geoMostPopular')) {
        if (config.get('switches.extendedMostPopularFronts')) {
            new GeoMostPopularFrontExtended().go();
        } else {
            new GeoMostPopularFront().go();
        }
    }
};

const showWeather = () => {
    if (config.get('switches.weather')) {
        mediator.on('page:front:ready', () => {
            Weather.init();
        });
    }
};

const showLiveblogUpdates = () => {
    if (
        isBreakpoint({
            min: 'desktop',
        })
    ) {
        mediator.on('page:front:ready', () => {
            showUpdatesFromLiveBlog();
        });
    }
};

const upgradeVideoPlaylists = () => {
    $('.js-video-playlist').each(el => {
        videoContainerInit(el);
    });
};

const finished = () => {
    mediator.emit('page:front:ready');
};

const addContributionBannerToAudioSeries = () => {
    const isFlagshipPage = $('#flagship-audio').length > 0;
    if (isFlagshipPage) {
        addContributionsBanner();
    }
};

const init = () => {
    catchErrorsWithContext([
        ['f-accessibility', shouldHideFlashingElements],
        ['f-snaps', showSnaps],
        ['f-show-more', showContainerShowMore],
        ['f-container-toggle', showContainerToggle],
        ['f-geo-most-popular', upgradeMostPopularToGeo],
        ['f-lazy-load-containers', lazyLoadContainers],
        ['f-stocks', stocks],
        ['f-weather', showWeather],
        ['f-live-blog-updates', showLiveblogUpdates],
        ['f-video-playlists', upgradeVideoPlaylists],
        ['f-audio-flagship-contributions', addContributionBannerToAudioSeries],
        ['f-region-selector', initRegionSelector],
        ['f-finished', finished],
    ]);
};

export { init };
