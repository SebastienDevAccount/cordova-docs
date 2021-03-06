var Preact = require('preact'),
    h = require('preact').h,
    createClass = require('preact-compat').createClass,
    SupportedPlatforms = require('./supportedplatforms.jsx'),
    classNames      = require('classnames');

var Plugin = createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
        return this.props.plugin !== nextProps.plugin;
    },
    copyText: function() {
        var range = document.createRange();
        var elements = this.getDOMNode().getElementsByClassName("cordova-add-command");
        if(elements.length > 0) {
            range.selectNode(elements[0]);

            var select = window.getSelection();
            select.removeAllRanges();
            select.addRange(range);

            try {
                document.execCommand("copy");
            } catch(e) {
                // Silently fail for now
            }

            select.removeAllRanges();
        }
    },
    render: function() {
        if(!this.props.plugin) {
            // Empty card with loading wheel
            return (
                <div className="container plugin-results-result">
                    <div className="row">
                        <div className="col-sm-9">
                            <h2>Loading...</h2>
                        </div>
                    </div>
                </div>
            )
        }

        var license = this.props.plugin.license;
        if (license && license.length > 1) {
            license = license[0];
        }
        var downloadField;
        var copyIcon;
        var npmLink = 'https://www.npmjs.com/package/' + this.props.plugin.name;

        if(this.props.plugin.downloadCount) {
            var downloadCount = this.props.plugin.downloadCount.toLocaleString();
            downloadField = <p className="downloads"><strong>{downloadCount}</strong> downloads last month</p>;
        }

        if(this.props.plugin) {
            copyIcon = (
                    <img
                        id={"copy-" + this.props.plugin.name}
                        className="plugins-copy-to-clipboard"
                        src="{{ site.baseurl}}/static/img/copy-clipboard-icon.svg"
                        title="Copy cordova plugin add command to clipboard"
                        data-toggle="tooltip"
                        data-placement="auto"
                        onClick={this.copyText} />
            );
        }

        var classes = classNames({
            'container': true,
            'plugin-results-result': true,
            'plugins-featured': this.props.plugin.isOfficial
        });

        return (
            <div className={classes}>
                <div className="row">
                    <div className="col-sm-8 col-xs-8">
                        <span>
                            <h2><a href={npmLink} onClick={trackOutboundLink.bind(this, npmLink)} target="_blank">{this.props.plugin.name}</a></h2>
                            <p className="version_and_author">v{this.props.plugin.version} by <strong>{this.props.plugin.author}</strong></p>
                        </span>
                    </div>
                    <div className="col-sm-4 col-xs-4">
                        {copyIcon}
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-8">
                        <p>{this.props.plugin.description}</p>
                        <SupportedPlatforms keywords={this.props.plugin.keywords} plugin={this.props.plugin.name}/>
                    </div>
                    <div className="col-sm-3 col-sm-offset-1">
                        <hr className="visible-xs results-divider-line"/>
                        <p className="license">{license}</p>
                        {downloadField}
                        <p className="last-updated">Last updated <strong>{this.props.plugin.modified} days ago</strong></p>
                    </div>
                </div>
                <div className="cordova-add-command">
                {"cordova plugin add " + this.props.plugin.name}
                </div>
            </div>
        )
    },
    componentDidMount: function() {
        this.copyText();
        if(this.props.plugin) {
            $(this.getDOMNode()).find(".plugins-copy-to-clipboard").tooltip();
        }
    },
    componentDidUpdate: function() {
        this.copyText();
    }
});

function trackOutboundLink(url) {
    ga('send', 'event', 'outbound', 'click', url);
}

module.exports = Plugin;
