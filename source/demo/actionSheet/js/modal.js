(function($, undefined) {
    var actionSheet = {};

    var _modalTemplateTempDiv = document.createElement('div');

    actionSheet.actions = function(params) {
        var modal,
            groupSelector,
            buttonSelector,
            self = this;
        params = params || [];

        if (params.length > 0 && !$.isArray(params[0])) {
            params = [params];
        }
        var modalHTML;
        var buttonsHTML = '';
        for (var i = 0; i < params.length; i++) {
            for (var j = 0; j < params[i].length; j++) {
                if (j === 0) buttonsHTML += '<div class="actions-modal-group">';
                var button = params[i][j];
                var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';
                if (button.bold) buttonClass += ' actions-modal-button-bold';
                if (button.color) buttonClass += ' color-' + button.color;
                if (button.bg) buttonClass += ' bg-' + button.bg;
                if (button.disabled) buttonClass += ' disabled';
                buttonsHTML += '<div class="' + buttonClass + '">' + button.text + '</div>';
                if (j === params[i].length - 1) buttonsHTML += '</div>';
            }
        }
        modalHTML = '<div class="actions-modal">' + buttonsHTML + '</div>';

        _modalTemplateTempDiv.innerHTML = modalHTML;
        modal = $(_modalTemplateTempDiv).children();
        $('body').append(modal[0]);

        groupSelector = '.actions-modal-group';
        buttonSelector = '.actions-modal-button';

        var groups = modal.find(groupSelector);

        groups.each(function(index, el) {
            var groupIndex = index;
            $(el).children().each(function(index, el) {
                var buttonIndex = index;
                var buttonParams = params[groupIndex][buttonIndex];
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
    };
    actionSheet.openModal = function(modal) {
        modal = $(modal);

        var overlay,
            self = this;
        if ($('.modal-overlay').length === 0) {
            $('body').append('<div class="modal-overlay"></div>');
        }
        overlay = $('.modal-overlay');

        overlay.on('click', function(e) {
            self.closeModal && self.closeModal(modal[0]);
        });
        var clientLeft = modal[0].clientLeft;

        modal.trigger('open');

        overlay.addClass('modal-overlay-visible');
        modal.removeClass('modal-out').addClass('modal-in');
        return true;
    };
    actionSheet.closeModal = function(modal) {
        modal = $(modal || '.modal-in');
        if (typeof modal !== 'undefined' && modal.length === 0) {
            return;
        }

        var removeOnClose = modal.hasClass('remove-on-close');

        var overlay = $('.modal-overlay');
        overlay.off('click');
        if (overlay && overlay.length > 0) {
            overlay.removeClass('modal-overlay-visible');
        }

        modal.trigger('close');

        modal.removeClass('modal-in').addClass('modal-out');

        // 移除自身
        // modal.remove();
        modal.on(transitionEnd(), function(e) {
            $(this).remove();
        });
        return true;
    };

    // 事件支持检测
    function transitionEnd() {
        var vendors = ['Webkit', '', 'Moz', 'O'],
            eventPrefix,
            testEl = document.createElement('div');

        vendors.every(function(vendor) {
            if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
                eventPrefix = vendor.toLowerCase();
            }
        });
        return eventPrefix + 'TransitionEnd';
    }

    if (typeof module !== 'undefined') {
        module.exports = actionSheet;
    } else {
        window.actionSheet = actionSheet;
    }
})(Zepto);