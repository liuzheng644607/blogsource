var docEl = document,
    testEl = docEl.createElement('div'),
    vendors = ['Moz', 'Webkit', 'o'],
    eventPrefix;

// 支持检测
vendors.every(function(vendor) {
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
        eventPrefix = vendor.toLowerCase();
    }
});

function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}
// actionSheet 单例
var actionSheet = {
    show: function(options) {
        var actionEl,
            groupSelector,
            buttonSelector,
            modalHTML,
            buttonsHTML = '',
            _tempDiv = docEl.createElement('div'),
            self = this;
        options = options || [];

        if (options.length > 0 && !isArray(options[0])) {
            options = [options];
        }

        for (var i = 0; i < options.length; i++) {
            for (var j = 0; j < options[i].length; j++) {
                if (j === 0) buttonsHTML += '<div class="actions-modal-group">';

                var button = options[i][j];
                var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';

                // 自定义class
                if (button.hasOwnPropperty('class')) buttonClass += ' ' + button.class;

                buttonsHTML += '<div class="' + buttonClass + '">' + button.text + '</div>';

                if (j === options[i].length - 1) buttonsHTML += '</div>';
            }
        }
        modalHTML = '<div class="actions-modal">' + buttonsHTML + '</div>';
        _tempDiv.innerHTML = modalHTML;
        actionEl = $(_tempDiv).children();
        $('body').append(actionEl[0]);

        groupSelector = '.actions-modal-group';
        buttonSelector = '.actions-modal-button';

        var groups = modal.find(groupSelector);

        groups.each(function(index, el) {
            var groupIndex = index;
            $(el).children().each(function(index, el) {
                var buttonIndex = index;
                var buttonParams = options[groupIndex][buttonIndex];
                var clickTarget;
                if ($(el).is(buttonSelector)) clickTarget = $(el);
                if (clickTarget) {
                    clickTarget.on('click', function(e) {
                        if (buttonParams.close !== false) self.closeModal(modal);
                        if (buttonParams.onClick) buttonParams.onClick(modal, e);
                    });
                }
            });
        });
        self.openModal(modal);
        return modal[0];
    },
    hide: function() {},
    open: function() {}
};