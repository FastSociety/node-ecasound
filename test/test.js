    var ECASound = require('../lib/ecasound');
    var Track    = ECASound.Track;

    var aTracks          = [
        {
            name:   'soundtrack',
            audio:  'soundtrack.wav',
            start:  0,
            length: 60
        },
        {
            name:   'sample0',
            audio:  'other.wav',
            start:  1,
            length: 5
        },
        {
            name:   'sample1',
            audio:  'other.wav',
            start:  10,
            length: 10
        },
        {
            name:   'sample2',
            audio:  'other.wav',
            start:  30,
            length: 10
        },
        {
            name:   'sample3',
            audio:  'other.wav',
            start:  41,
            length: 9
        },
        {
            name:   'sample4',
            audio:  'other.wav',
            start:  55,
            length: 5
        }
    ];

    var iMusicHigh       = 1.0;
    var iMusicLow        = 0;
    var iFadeTime        = 2;
    var iHalfFade        = iFadeTime / 2;

    var oMixer = new ECASound();
    oMixer.setLength(60);

    var oTrack = aTracks.shift();
    var oBackground = new Track(oTrack.name, oTrack.audio).play(oTrack.start).until(oTrack.length);

    oMixer.addTrack(oBackground);

    var bFadeIn  = true;
    var bFadeOut = true;

    for (var sTrack in aTracks) {
        oTrack = aTracks[sTrack];

        if (oTrack.start < iFadeTime) {
            bFadeIn = false;
        }

        if (oBackground.pproperty('me.end') - (oTrack.start + oTrack.length) < iFadeTime) {
            bFadeOut = false;
        }
    }

    if (bFadeIn) {
        oBackground.fade(1, 0, iHalfFade);
    }

    for (var sTrack in aTracks) {
        oTrack = aTracks[sTrack];

        var iTrackFade = iHalfFade;
        if (oTrack.length < iFadeTime) {
            iTrackFade = oTrack.length / 3
        }

        oMixer.addTrack(
            new Track(oTrack.name, oTrack.audio)
                .play(oTrack.start)
                .until(oTrack.length)
                .volume(100 * aTracks.length)
                .fade(0.0, 0)
                .fade(1.0, iTrackFade)
                .fade(0.0, iTrackFade, 'me.end - ' + iTrackFade)
        );

        var iTrack = parseInt(sTrack, 10);

        var oPrevious = aTracks[iTrack - 1];
        if (oPrevious !== undefined) {
            if (oTrack.start - (oPrevious.start + oPrevious.length) > iFadeTime) {
                // Distance between previous and current track is more than full fade time so fade out
                oBackground.fade(iMusicLow,  oTrack.name + '.start - ' + iHalfFade, iFadeTime);
            }
        } else if (oTrack.start > iFadeTime) {
            // Fades out because it's not too close to the beginning
            oBackground.fade(iMusicLow,  oTrack.name + '.start - ' + iHalfFade, iFadeTime);
        }

        var oNext = aTracks[iTrack + 1];
        if (oNext !== undefined) {
            if (oNext.start - (oTrack.start + oTrack.length) > iFadeTime) {
                // Distance between next and current track is more than full fade time so fade out
                oBackground.fade(iMusicHigh, oTrack.name + '.end   - ' + iHalfFade, iFadeTime);
            }
        } else if (oBackground.pproperty('me.end') - (oTrack.start + oTrack.length) > iFadeTime) {
            // Fades back in because its not too close to the end
            oBackground.fade(iMusicHigh, oTrack.name + '.end   - ' + iHalfFade, iFadeTime);
        }
    }

    if (bFadeOut) {
        oBackground.fade(0.0, 'me.end - ' + iHalfFade, iHalfFade);
    }

    console.log('ecasound', oMixer.consoleOutput().command.join(' ').replace('whatever-output-filename-is', 'test2'));
    console.log(oMixer.consoleMixerOutput());