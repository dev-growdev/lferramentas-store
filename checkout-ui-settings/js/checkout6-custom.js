(function ($) {
  "use strict";
 
  if (!$) {
    return;
  }
 
  // Domínio bloqueado. Qualquer e-mail que termine com este sufixo é bloqueado.
  var BLOCKED_DOMAIN = "@babyeat.food";
 
  var EMAIL_INPUT_SELECTOR = "#client-email";
  var MODAL_SELECTOR = "#vtex-email-block-modal";
  var PAYMENT_HASH_FRAGMENT = "/payment";
  var CART_HASH = "#/cart";
 
  // Guarda o último e-mail conhecido (via input ou orderForm), usado
  // para decidir se o usuário pode permanecer na etapa de pagamento.
  var lastKnownEmail = null;
 
  function isBlocked(email) {
    if (!email) return false;
    email = email.trim().toLowerCase();
    return email.endsWith(BLOCKED_DOMAIN);
  }
 
  function isOnPaymentStep() {
    return window.location.hash.indexOf(PAYMENT_HASH_FRAGMENT) !== -1;
  }
 
  function redirectToCart() {
    if (window.location.hash !== CART_HASH) {
      window.location.hash = CART_HASH;
    }
  }
 
  // ---- Modal --------------------------------------------------------------
 
  function showModal() {
    if ($(MODAL_SELECTOR).length) return;
 
    var $overlay = $(
      '<div id="vtex-email-block-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;">' +
        '<div style="background:#fff;border-radius:8px;padding:24px;max-width:340px;width:90%;text-align:center;font-family:inherit;box-shadow:0 8px 24px rgba(0,0,0,0.2);">' +
          '<h3 style="margin:0 0 12px;color:#a30000;">Não foi possível continuar</h3>' +
          '<p style="margin:0 0 20px;color:#333;font-size:14px;">Por favor, utilize outro e-mail para continuar sua compra.</p>' +
          '<button id="vtex-email-block-btn" style="background:#a30000;color:#fff;border:none;border-radius:4px;padding:10px 20px;cursor:pointer;font-weight:bold;">Trocar e-mail</button>' +
        "</div>" +
      "</div>"
    );
 
    $("body").append($overlay);
 
    $overlay.find("#vtex-email-block-btn").on("click", function () {
      $overlay.remove();
      var $input = $(EMAIL_INPUT_SELECTOR);
      if ($input.length) {
        $input
          .val("")
          // Dispara o evento input para que o knockout do checkout também
          // limpe seu próprio estado interno (observable "email").
          .trigger("input")
          .trigger("focus");
      }
    });
  }
 
  // Ponto único chamado por todas as validações: decide se precisa
  // mostrar o modal e/ou redirecionar, com base no e-mail mais recente
  // conhecido e na etapa atual (hash) da URL.
  function enforceGuard(email) {
    lastKnownEmail = email;
 
    if (!isBlocked(email)) return;
    if (!isOnPaymentStep()) return;
 
    showModal();
    redirectToCart();
  }
 
  // ---- Validação 1: campo #client-email -----------------------------
  // Cobre tanto a digitação manual (blur) quanto o cenário de o campo já
  // vir preenchido/alterado sem que o usuário interaja diretamente com
  // ele (autofill do navegador, preenchido via outra tela, valor setado
  // programaticamente pelo próprio checkout, etc). Por isso, além do
  // blur, mantemos uma checagem periódica leve do valor atual do input.
 
  function onEmailBlur() {
    var $input = $(EMAIL_INPUT_SELECTOR);
    if ($input.length) {
      enforceGuard($input.val());
    }
  }
 
  function attachListener() {
    var $input = $(EMAIL_INPUT_SELECTOR);
    if ($input.length && !$input.data("emailCheckAttached")) {
      $input.data("emailCheckAttached", true);
      $input.on("blur", onEmailBlur);
    }
  }
 
  // O campo #client-email pode ser renderizado um pouco depois do load
  // (checkout é SPA). Tenta anexar algumas vezes nos primeiros segundos,
  // sem ficar observando o DOM continuamente.
  var attempts = 0;
  var attachInterval = setInterval(function () {
    attachListener();
    attempts++;
    if ($(EMAIL_INPUT_SELECTOR).length || attempts > 20) {
      clearInterval(attachInterval);
    }
  }, 500);
 
  // Checagem periódica do valor do input, independente de interação do
  // usuário. Também serve como rede de segurança: se o usuário navegar
  // para #/payment com um e-mail já bloqueado (sem disparar blur), essa
  // checagem detecta em até 1s e redireciona.
  var INPUT_POLL_INTERVAL_MS = 1000;
  setInterval(function () {
    var $input = $(EMAIL_INPUT_SELECTOR);
    if ($input.length) {
      enforceGuard($input.val());
    } else if (lastKnownEmail) {
      // Campo de e-mail não está mais no DOM (usuário avançou de etapa),
      // mas ainda temos o último valor conhecido -> continua validando
      // contra a etapa atual.
      enforceGuard(lastKnownEmail);
    }
  }, INPUT_POLL_INTERVAL_MS);
 
  // ---- Validação 2: e-mail direto no orderForm ---------------------------
  // Cobre cenários em que o e-mail já vem preenchido (cliente logado,
  // e-mail salvo/carregado automaticamente, ou inserido em outra etapa/
  // tela) e o campo #client-email não necessariamente dispara "blur".
 
  function checkOrderFormEmail(orderForm) {
    if (!orderForm || !orderForm.clientProfileData) return;
    enforceGuard(orderForm.clientProfileData.email);
  }
 
  // 2a. Escuta o evento nativo do checkout disparado sempre que o
  // orderForm é atualizado (troca de etapa, autofill, login, etc).
  $(window).on("orderFormUpdated.vtex", function (event, orderForm) {
    checkOrderFormEmail(orderForm);
  });
 
  // 2b. Checagem inicial ao carregar a página, cobrindo o caso do
  // e-mail já vir preenchido desde o início (ex: checkout iniciado com
  // sessão/carrinho de um cliente já identificado).
  var orderFormAttempts = 0;
  var orderFormInterval = setInterval(function () {
    if (window.vtexjs && window.vtexjs.checkout && window.vtexjs.checkout.orderForm) {
      checkOrderFormEmail(window.vtexjs.checkout.orderForm);
      clearInterval(orderFormInterval);
    }
    orderFormAttempts++;
    if (orderFormAttempts > 20) {
      clearInterval(orderFormInterval);
    }
  }, 500);
 
  // ---- Validação 3: mudança de etapa (hash da URL) -----------------------
  // Cobre o caso do usuário navegar direto para #/payment (ex: voltar
  // pelo histórico do navegador, link direto, etc) com o e-mail já
  // bloqueado conhecido de checagens anteriores.
  $(window).on("hashchange", function () {
    if (lastKnownEmail) {
      enforceGuard(lastKnownEmail);
    }
  });
})(window.$ || window.jQuery);

$(document).ready(function productImageSize() {
  // melhora a qualidade da imagem dos produtos no carrinho
  var imgs = setInterval(() => {
    if ($('.product-item .product-image img').length > 0) {
      $('.product-item .product-image img').each(function (_, img) {
        let url = $(img).attr('src').replace('55-55', '155-155')
        $(img).attr('src', url)
      })
      clearInterval(imgs)
    }
  }, 100)
})

try {
  var waitUntilExists = function waitUntilExists(selector, cb) {
    var findElement = setInterval(function () {
      var $el = $(selector)
      if ($el.length) {
        clearInterval(findElement)

        cb($el)
      }
    }, 300)
  }

  function openShipping() {
    let isCartPage = window.location.hash === '#/cart'
    let verifyIfHaveInput = $('.vtex-shipping-preview-0-x-frame').length > 0
    if (isCartPage && !verifyIfHaveInput) {
      var putInput = setTimeout(() => {
        $('#shipping-calculate-link').click()

        if (verifyIfHaveInput) {
          clearInterval(putInput)
        }
      }, 1000)
      setPlaceholder()
    }
  }

  function setPlaceholder() {
    var placeholder = setInterval(() => {
      let inputToPlaceholder = $('#ship-postalCode').length > 0
      if (inputToPlaceholder) {
        $('#ship-postalCode').attr({
          placeholder: 'Digite o CEP',
        })
        clearInterval(placeholder)
      }
    }, 300)
  }

  function showCepError($input) {
    const $wrapper = $input.closest('.step.accordion-group.shipping-data.active')
    const $wrapperSecond = $input.closest('.vtex-shipping-preview-0-x-postalCodeForgotten')
    const $wrapperThird = $input.closest('.vtex-omnishipping-1-x-addressFormPart1')

    $input.addClass('input-error cep-invalid')
    $wrapper.addClass('input-error cep-invalid')
    $wrapperSecond.addClass('input-error cep-invalid')
    $wrapperThird.addClass('input-error cep-invalid')

    $('#cart-shipping-calculate').prop('disabled', true)

    hideShippingResults($input)
  }

  function removeCepError($input) {
    const $wrapper = $input.closest('.step.accordion-group.shipping-data.active')

    $input.removeClass('input-error cep-invalid')
    $wrapper.removeClass('input-error cep-invalid')

    $input.next('.cep-error').remove()

    $('#cart-shipping-calculate').prop('disabled', false)
  }

  function hideShippingResults($input) {
    const $section = $input.closest('[class*="step accordion-group shipping-data"], [class*="addressFormPart1"]')
    $section.find('[class*="shippingOptions"], [class*="deliveryOptions"], [class*="addressForm"]').hide()
  }

  function showShippingResults($input) {
    const $section = $input.closest('[class*="step accordion-group shipping-data"], [class*="addressFormPart1"]')
    $section.find('[class*="shippingOptions"], [class*="deliveryOptions"], [class*="addressForm"]').show()
  }

  function formatCep(value) {
    const cep = value.replace(/\D/g, '')

    if (cep.length <= 5) {
      return cep
    }

    return cep.substring(0, 5) + '-' + cep.substring(5, 8)
  }

  function validateCep($input, abortController) {
    let cep = $input.val().replace(/\D/g, '')

    if (cep.length !== 8) return

    fetch(`https://opencep.com/v1/${cep}`, {
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          showCepError($input)
          hideShippingResults($input)
        } else {
          removeCepError($input)
          showShippingResults($input)
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        showCepError($input)
        hideShippingResults($input)
      })
  }

  function cepValidation() {
    let debounceTimer
    let currentAbortController = null

    $(document).on('keyup', '#ship-postalCode, #cart-shipping-postal-code', function () {
      const $input = $(this)
      let formattedCep = formatCep($input.val())
      $input.val(formattedCep)

      let cep = formattedCep.replace(/\D/g, '')

      // Cancela requisição anterior imediatamente
      if (currentAbortController) {
        currentAbortController.abort()
        currentAbortController = null
      }

      clearTimeout(debounceTimer)
      $('#cart-shipping-calculate').prop('disabled', true)

      // Esconde resultados anteriores da VTEX a cada nova digitação
      hideShippingResults($input)

      if (cep.length === 8) {
        debounceTimer = setTimeout(() => {
          currentAbortController = new AbortController()
          validateCep($input, currentAbortController)
        }, 400)
      }
    })
  }

  function validatePrefilledCep() {
    const $cepInput = $('#ship-postalCode, #cart-shipping-postal-code')

    if ($cepInput.length) {
      let formattedCep = formatCep($cepInput.val())
      $cepInput.val(formattedCep)

      let cep = formattedCep.replace(/\D/g, '')

      if (cep.length === 8) {
        const abortController = new AbortController()
        validateCep($cepInput, abortController)
      }
    }
  }

  function updateSteps() {
    // timeline
    let steps = ['cart', 'email', 'profile', 'shipping', 'payment']
    let hash = window?.location?.hash.split('/')

    waitUntilExists('.cart-ctn', ($step) => {
      let shouldBeActive = hash.includes(steps[0])
      let shouldBeSuccessful = steps.indexOf(hash[1]) > 0

      $step.toggleClass('cart-ctn--active', shouldBeActive)
      $step.toggleClass('cart-ctn--success', shouldBeSuccessful)
    })

    waitUntilExists('.profile-ctn', ($step) => {
      let shouldBeActive = hash.includes(steps[1]) || hash.includes(steps[2])
      let shouldBeSuccessful = steps.indexOf(hash[1]) > 2

      $step.toggleClass('profile-ctn--active', shouldBeActive)
      $step.toggleClass('profile-ctn--success', shouldBeSuccessful)
    })

    waitUntilExists('.payment-ctn', ($step) => {
      let shouldBeActive = hash.includes(steps[4])
      let shouldBeSuccessful = steps.indexOf(hash[1]) > 4

      $step.toggleClass('payment-ctn--active', shouldBeActive)
      $step.toggleClass('payment-ctn--success', shouldBeSuccessful)
    })

    waitUntilExists('.payment-data', ($step) => {
      let shouldBeActive = hash.includes(steps[3])

      $step.toggleClass('payment--active', shouldBeActive)
    })

    waitUntilExists('.shipping-ctn', ($step) => {
      let shouldBeActive = hash.includes(steps[3])
      let shouldBeSuccessful = steps.indexOf(hash[1]) > 3

      $step.toggleClass('shipping-ctn--active', shouldBeActive)
      $step.toggleClass('shipping-ctn--success', shouldBeSuccessful)
    })
  }

  $(window).on('orderFormUpdated.vtex', function () {
    setTimeout(() => {
      validatePrefilledCep();
    }, 1000);
  });

  $(window).on('hashchange', () => {
    updateSteps()
    cepValidation();

    setTimeout(() => {
      validatePrefilledCep();
    }, 1000);
  })

  $(document).on('change', function () {
    setPlaceholder()
    cepValidation()
    setTimeout(() => {
      validatePrefilledCep();
    }, 1000);
  })

  $(document).ready(function () {
    updateSteps()
    openShipping()

    setTimeout(() => {
      validatePrefilledCep();
    }, 1000);
  })
} catch (e) {
  console.log(e)
}

var optin = {
  addOptIn: function ($containerToAdd) {
    var _this = this
    var userEmail =
      vtexjs && vtexjs.checkout && vtexjs.checkout.orderForm && vtexjs.checkout.orderForm.clientProfileData
        ? vtexjs.checkout.orderForm.clientProfileData.email
        : $('input#client-email').val()
    $('.optin-custom', $containerToAdd).remove()
    $containerToAdd.append(
      "<div class='optin-custom'>" +
        " <p class='optin-title'>Para que você receba ofertas especiais, precisamos da sua permissão para mandar mensagens com vantagens exclusivas.</p>" +
        " <p class='optin-subtitle'>Você pode alterar sua preferência a qualquer momento.</p>" +
        " <label class='checkbox optin-check-all' for='optin-check-all'>" +
        "   <input type='checkbox' id='optin-check-all' />" +
        "   <span class='optin-text'>Aceito receber comunicações através de todos os canais disponíveis.</span>" +
        ' </label>' +
        " <div class='optin-radio'>" +
        "   <span class='optin-text'>SMS</span>" +
        "   <div class='optin-radio-options'>" +
        "     <input type='radio' name='opt-in-sms' id='opt-in-sms--true' value='true'>" +
        "     <label for='opt-in-sms--true'>Aceito</label>" +
        "     <input type='radio' name='opt-in-sms' id='opt-in-sms--false' value='false'>" +
        "     <label for='opt-in-sms--false'>Não aceito</label>" +
        '   </div>' +
        ' </div>' +
        " <div class='optin-radio'>" +
        "   <span class='optin-text'>WhatsApp</span>" +
        "   <div class='optin-radio-options'>" +
        "     <input type='radio' name='opt-in-whatsapp' id='opt-in-whatsapp--true' value='true'>" +
        "     <label for='opt-in-whatsapp--true'>Aceito</label>" +
        "     <input type='radio' name='opt-in-whatsapp' id='opt-in-whatsapp--false' value='false'>" +
        "     <label for='opt-in-whatsapp--false'>Não aceito</label>" +
        '   </div>' +
        ' </div>' +
        " <div class='optin-radio'>" +
        "   <span class='optin-text'>E-mail</span>" +
        "   <div class='optin-radio-options'>" +
        "     <input type='radio' name='opt-in-email' id='opt-in-email--true' value='true'>" +
        "     <label for='opt-in-email--true'>Aceito</label>" +
        "     <input type='radio' name='opt-in-email' id='opt-in-email--false' value='false'>" +
        "     <label for='opt-in-email--false'>Não aceito</label>" +
        '   </div>' +
        ' </div>' +
        '</div>'
    )

    $(".optin-custom input[type='radio']").on('change', function () {
      if ($(".optin-custom input[type='radio'][id*='--false']").length > 0)
        $('.optin-custom input#optin-check-all').attr('checked', false)
      if (
        $(".optin-custom input[type='radio'][id*='--true']").length ==
        $(".optin-custom input[type='radio'][id*='--true']:checked").length
      )
        $('.optin-custom input#optin-check-all').attr('checked', true)
    })

    $('#go-to-shipping').on('click', function () {
      var url = '/_v/cl/'
      var optinObj = {
        email: userEmail,
        optin_whatsapp: _this.getCheckedOptin('whatsapp'),
        optin_sms: _this.getCheckedOptin('sms'),
        optin_email: _this.getCheckedOptin('email'),
      }
      $.ajax({
        url: '/_v/cl/email/' + userEmail,
        headers: {
          Accept: 'application/vnd.vtex.ds.v10+json',
          'Content-Type': 'application/json',
        },
        type: 'GET',
        cache: false,
        success: function (resp) {
          if (!resp) {
            _this.sendOptinData(url, 'POST', optinObj)
          } else {
            url = url + resp.id
            _this.sendOptinData(url, 'PATCH', optinObj)
          }
        },
      })
    })

    $('.optin-custom input#optin-check-all').on('change', function () {
      var isChecked = !!$(this).attr('checked')
      var hasChanged =
        $("input[type='radio'][id*='--true']:checked").length !== $("input[type='radio'][id*='--true']").length
      if (isChecked) $("input[type='radio'][id*='--true']").attr('checked', isChecked)
      if (hasChanged) $("input[type='radio'][id*='--true']").first().trigger('change')
    })

    $('.link-logout').on('click', function () {
      window.localStorage.removeItem('optinObj')
    })

    $(window).on('orderFormUpdated.vtex', function (orderForm) {
      userEmail = orderForm.clientProfileData ? orderForm.clientProfileData.email : $('input#client-email').val()
    })

    if (vtexjs.checkout.orderForm.loggedIn) {
      $.ajax({
        url:
          '/api/io/safedata/CL/search?_where=email=' +
          userEmail +
          '&_fields=id,optin_sms,optin_whatsapp,optin_email&v=' +
          Date.now(),
        headers: {
          Accept: 'application/vnd.vtex.ds.v10+json',
          'Content-Type': 'application/json',
        },
        cache: false,
        type: 'GET',
        success: function (data) {
          if (data.length) {
            _this.userRegistryId = data[0].id
            _this.checkOptin({
              optin_whatsapp: data[0].optin_whatsapp,
              optin_sms: data[0].optin_sms,
              optin_email: data[0].optin_email,
            })
          }
        },
      })
    } else {
      var optinObj = JSON.parse(window.localStorage.getItem('optinObj') || '{}')
      _this.checkOptin(optinObj)
    }
  },
  sendOptinData: function (url, type, optinObject) {
    $.ajax({
      url: url,
      type: type,
      dataType: 'json',
      headers: {
        Accept: 'application/vnd.vtex.ds.v10+json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(optinObject),
      success: function (data) {},
      error: function (data) {
        console.error('error', data)
      },
    })

    delete optinObject.email
    window.localStorage.setItem('optinObj', JSON.stringify(optinObject))
  },
  checkOptin: function (optinObject) {
    if (typeof optinObject.optin_whatsapp == 'boolean')
      optinObject.optin_whatsapp
        ? $('#opt-in-whatsapp--true').attr('checked', true)
        : $('#opt-in-whatsapp--false').attr('checked', true)
    if (typeof optinObject.optin_sms == 'boolean')
      optinObject.optin_sms
        ? $('#opt-in-sms--true').attr('checked', true)
        : $('#opt-in-sms--false').attr('checked', true)
    if (typeof optinObject.optin_email == 'boolean')
      optinObject.optin_email
        ? $('#opt-in-email--true').attr('checked', true)
        : $('#opt-in-email--false').attr('checked', true)

    if (
      $(".optin-custom input[type='radio'][id*='--true']").length ==
      $(".optin-custom input[type='radio'][id*='--true']:checked").length
    )
      $('.optin-custom input#optin-check-all').attr('checked', true)
  },
  getCheckedOptin: function (optinKey) {
    var checkedInput = $("input[type='radio'][name='opt-in-" + optinKey + "']:checked")
    if (checkedInput.val() == 'true') return true
    if (checkedInput.val() == 'false') return false
    return undefined
  },
}

function addShowPessoaFisicaFormButton() {
  const isMobile = window.innerWidth < 1024
  const buttonText = isMobile ? 'Comprar com CPF (Pessoa Física)' : 'Realizar compra com CPF (Pessoa Física)'
  const hasButton = $('#button-show-pf')?.length > 0

  if (hasButton) {
    return
  }

  const buttonHtml = `
    <button class="button-show-pf" id="button-show-pf" type="button">
      <span>
        ${buttonText}
      </span>
    </button>
  `

  const container = $('.box-client-info .row-fluid')
  container?.prepend(buttonHtml)

  $('#button-show-pf').on('click', showPfForm)
}

function addClientProfileNotice() {
  const noticeElement = `
    <p class="client-notice notice" data-i18n="clientProfileData.notice">
      Solicitamos apenas as informações essenciais para a realização da compra.
    </p>
  `

  const buttonContainer = $('.box-client-info .row-fluid')

  buttonContainer?.prepend(noticeElement)
}

function showPfForm() {
  const pfForm = $('.box-client-info .box-client-info-pf')
  const goToShippingButton = $('#go-to-shipping')
  const optinContainer = $('.checkout-optin')
  const showPfButton = $('#button-show-pf')
  const oldMessage = $('.box-client-info .row-fluid > .client-notice')
  const pjButtonsContainer = $('.corporate-hide-link')

  pfForm.show()
  goToShippingButton.show()
  optinContainer.show()

  showPfButton?.hide()
  oldMessage?.remove()
  pjButtonsContainer.addClass('has-margin-bottom')
}

function handlePessoaJuridicaEvent() {
  const button = $('#is-corporate-client')

  button.on('click', () => {
    showPfForm()
  })
}

/**
 * Hides the "Go to shipping" button if the "Go to payment" button is visible.
 * This is necessary because the "Go to shipping" button is only supposed to be
 * visible when the "Go to payment" button is not visible.
 */
function handleGoToShippingVisibility() {
  const goToPaymentButton = $('#go-to-payment')
  const goToShippingButton = $('#go-to-shipping')

  const goToPaymentButtonStyle = goToPaymentButton?.attr('style')
  const goToPaymentButtonHasDisplayNone = goToPaymentButtonStyle?.includes('display: none')

  if (goToPaymentButton?.length && !goToPaymentButtonHasDisplayNone) {
    goToShippingButton?.hide()
  }
}

function checkPersonalData() {
  const userEmail = $('#client-email').val()
  const userName = $('#client-first-name').val()
  const userLastName = $('#client-last-name').val()
  const userDocument = $('#client-document').val()
  const userPhone = $('#client-phone').val()

  if (!userEmail || !userName || !userLastName || !userDocument || !userPhone) {
    return false
  }

  return true
}

function checkCorporateData() {
  const userCorporateName = $('#client-company-name').val()
  const userCnpj = $('#client-company-document').val()

  if (!userCnpj || !userCorporateName) {
    return false
  }

  return true
}

function handleProfileForm() {
  const hasPersonalData = checkPersonalData()
  const hasCorporateData = checkCorporateData()

  if (hasPersonalData && !hasCorporateData) {
    showPfForm()
    return
  }

  if (hasCorporateData) {
    showPfForm()
    return
  }

  addShowPessoaFisicaFormButton()
  addClientProfileNotice()
  handlePessoaJuridicaEvent()
}

function handlePixPrice() {
  try {
    const orderForm = vtexjs.checkout.orderForm
    const installmentOptions = orderForm.paymentData.installmentOptions
    const freightPrice = orderForm.totalizers.find((item) => item.id === 'Shipping')?.value || 0

    const pixOption = installmentOptions.find((item) => item.paymentSystem === '125')
    const normalOption = installmentOptions.find((item) => item.paymentSystem === '1')

    const pixPrice = pixOption?.installments.find((item) => item.count === 1 && !item.hasInterestRate)?.total
    const normalPrice = normalOption?.installments.find((item) => item.count === 1 && !item.hasInterestRate)?.total

    const totalPix = pixPrice != null ? (pixPrice + freightPrice) / 100 : null
    const totalNormal = normalPrice != null ? normalPrice / 100 : null

    const arePixPricesEqual = pixPrice === normalPrice

    const pixPriceRow = $('.pix-price-row')
    const normalPriceRow = $('.normal-price-row')
    const productPriceRow = $('.summary-totalizers tr.Items td.monetary')

    productPriceRow.text(
      pixPrice
        ? pixPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : normalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    )

    // Remove Pix se não existir mais
    if (!pixPrice && pixPriceRow.length) {
      pixPriceRow.remove()
    }

    // Atualiza ou insere o preço normal SEMPRE
    const normalRowHtml = `
      <tr class="normal-price-row ${arePixPricesEqual || !pixPrice ? 'no-pix-row' : ''}">
        <td>${arePixPricesEqual || !pixPrice ? 'Total' : ''}</td>
        <td class="space"></td>
        <td>
          ${totalNormal !== null ? totalNormal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : ''}
          ${arePixPricesEqual ? `` : `a prazo`}
        </td>
        <td class="empty"></td>
      </tr>
    `
    if (normalPriceRow.length) {
      normalPriceRow.replaceWith(normalRowHtml)
    } else {
      $('.cart-totalizers tfoot').append(normalRowHtml)
    }

    if (pixPrice && !arePixPricesEqual) {
      const pixRowHtml = `
        <tr class="pix-price-row">
          <td>Total</td>
          <td class="space"></td>
          <td>
            ${totalPix.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
            <span>
              ou
            </span>
          </td>
          <td class="empty"></td>
        </tr>
      `
      if (pixPriceRow.length > 0) {
        pixPriceRow.replaceWith(pixRowHtml)
      } else {
        const normalPriceRow = $('.normal-price-row')

        if (normalPriceRow.length > 0) {
          $(pixRowHtml).insertBefore(normalPriceRow)
        } else {
          $('.cart-totalizers tfoot').append(pixRowHtml)
        }
      }
    }
  } catch (error) {
    console.error('Erro ao lidar com o preço do PIX:', error)
  }
}

function hideEqualPrices() {
  const rows = document.querySelectorAll('td.quantity-price')
  const monetaryCells = document.querySelectorAll('td.monetary')

  rows.forEach((row) => {
    const totalPrice = row.querySelector('.total-price')
    const totalPriceSpan = row.querySelector('.total-price span')
    const totalSellingPrice = row.querySelector('.total-selling-price')

    if (!totalPrice || !totalSellingPrice) return

    const spotText = totalPrice.childNodes[0]?.textContent?.trim()
    const sellingText = totalSellingPrice.childNodes[0]?.textContent?.trim()

    if (spotText && sellingText && spotText === sellingText) {
      totalSellingPrice.style.display = 'none'
      totalPriceSpan.style.display = 'none'
    } else {
      totalSellingPrice.style.display = ''
    }
  })

  monetaryCells.forEach((cell) => {
    const subtotalProduct = cell.querySelector('p.subtotal-product')
    const subtotalProductSpan = cell.querySelector('p.subtotal-product span')
    const prazoSpan = subtotalProduct?.nextElementSibling

    if (!subtotalProduct || !prazoSpan) return

    const spotText = subtotalProduct.childNodes[0]?.textContent?.trim()

    const prazoText = prazoSpan.textContent?.replace('a prazo', '').trim()

    if (spotText && prazoText && spotText === prazoText) {
      prazoSpan.style.display = 'none'
      subtotalProductSpan.style.display = 'none'
    } else {
      prazoSpan.style.display = ''
    }
  })
}

function handleEnderecoNaNotaModal() {
  const hasModal = $('.popup-backdrop').length > 0
  const shouldShowModal = vtexjs?.checkout?.orderForm?.clientProfileData?.isCorporate

  if (hasModal || !shouldShowModal) return

  const modalHTML = `
  <div class="popup-backdrop">
    <div class="popup-pj-alert">
      <button class="close-button" data-action="close-popup-pj-alert">&times;</button>
      <div class="popup-icon">
        <img src="https://www.lfmaquinaseferramentas.com.br/arquivos/popup-pj-alert-icon.svg" width="47" height="44" />
      </div>
      <h2 class="popup-title">Endereço na Nota Fiscal</h2>
      <p class="popup-text">
        A nota fiscal será emitida automaticamente com <br />
        o endereço da Receita Federal. <br />
        Em caso de dúvida, entre em contato conosco pelo WhatsApp.
      </p>
      <p class="popup-question">Deseja continuar?</p>
      <div class="popup-actions">
        <a href="https://api.whatsapp.com/send?1=pt_BR&phone=555131030100" class="btn-outline">CHAMAR NO WHATS</a>
        <button class="btn-primary" data-action="close-popup-pj-alert" >SIM, CONTINUAR</button>
      </div>
    </div>
  </div>
  `

  $('body').append(modalHTML)

  $(document).on('click', '[data-action="close-popup-pj-alert"]', function () {
    $('.popup-backdrop').remove()
  })

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('.popup-backdrop').remove()
    }
  })
}

$(window).on('load hashchange', function () {
  if (window.location.hash == '#/profile') {
    var timeoutOptin = function () {
      if ($('.box-client-info .newsletter')) {
        if ($('.box-client-info .newsletter + .checkout-optin').length == 0)
          $('.box-client-info .newsletter').after('<div class="checkout-optin"></div>')
        optin.addOptIn($('.box-client-info .newsletter + .checkout-optin'))
      } else setTimeout(timeoutOptin, 50)
    }
    timeoutOptin()
    handleProfileForm()
  }

  if (window.location.hash == '#/shipping') {
    setTimeout(() => {
      handleEnderecoNaNotaModal()
    }, 1500)
  }

  handleGoToShippingVisibility()
})

// call this handlePixPrice() on ajaxStop
/* $(window).on('orderFormUpdated.vtex', function () {
  handlePixPrice()
}) */

const observer = new MutationObserver(() => {
  hideEqualPrices()
})

observer.observe(document.body, {
  childList: true,
  subtree: true,
})



$(document).ready(function () {
  vendedores.init()
  hideEqualPrices()
  checkMarketingData()
  shareCart()
  floatHelpCheckout()
  replaceFooter()
  addRaScript()
})

//Código do vendedor
var vendedores = {
  init: function () {
    var setTemplate = setInterval(function () {
      if ($('.forms.coupon-column.summary-coupon-wrap.text-center').length > 0) {
        vendedores.addHtml()
        clearInterval(setTemplate)
      }
    }, 500)
  },

  addHtml: function () {
    let template = `
    <div class="forms vendedor-column summary-vendedor-wrap">
      <button class="add-vendedor-button">
        Adicionar código de vendedor
      </button>
      <div class="vendedor summary-vendedor" style="display: none">
        <form class="vendedor-form" action="">
          <fieldset class="vendedor-fieldset">
          <div>
            <p class="vendedor-label">
            <label>Código de vendedor</label> 
            </p>
            <div class="content-input-vendedor">
              <input type="text" class="vendedor-value input-small " placeholder="Código de vendedor">
              <button type="submit" class="vendedor-add">OK</button>
            </div>        
            <div class="vendedor-setted" style="display: none">	
              <span class="codigo-vendedor"></span>
              <span class="mudar-vendedor">excluir</span>
            </div>
          </div>
          </fieldset>
        </form>
      </div>
    </div>`

    $(template).appendTo('.forms.coupon-column.summary-coupon-wrap.text-center')
    vendedores.vendedorActions()
  },

  vendedorActions: function () {
    $('.vendedor-value').on('change', function () {
      const valor = $(this).val()
      $('.vendedor-value').val(valor)
    })

    $('.add-vendedor-button').click((e) => {
      e.preventDefault()
      $('.add-vendedor-button').hide()
      $('.vendedor.summary-vendedor').show()
    })

    $('.vendedor-add').click((e) => {
      e.preventDefault()
      let codValue = $('.vendedor-value').val()
      if (!codValue.length) {
        if (!$('.vendedor-value').hasClass('error-value')) {
          $('.vendedor-value').addClass('error-value')
          $('.error-value').attr('placeholder', 'Código inválido')
        }
        return false
      }
      $.ajax({
        headers: {
          accept: 'application/vnd.vtex.ds.v10+json',
          'Content-Type': 'application/json; charset=utf-8',
          'REST-Range': 'resources=0-100',
        },
        crossDomain: true,
        cache: false,
        type: 'GET',
        url: `/api/dataentities/CV/search?_where=utmi=${codValue}&_fields=code`,
      }).done((result) => {
        if (result.length === 0) {
          if (!$('.vendedor-value').hasClass('error-value')) {
            $('.vendedor-value').addClass('error-value')
          }
          $('.error-value').val('Código inválido')
          return false
        } else {
          vtexjs.checkout.getOrderForm().then(function (orderForm) {
            let utms = {}
            if (orderForm?.marketingData) {
              utms = orderForm?.marketingData
            }
            utms.utmiCampaign = codValue
            vtexjs.checkout.sendAttachment('marketingData', utms)
          })

          vtexjs.checkout.sendAttachment('openTextField', { value: codValue }).done(function (__orderForm) {
            if ($('.vendedor-value').hasClass('error-value')) {
              $('.vendedor-value').removeClass('error-value')
            }
            $('.content-input-vendedor, .vendedor-error, .codigo-vendedor-errado').hide()
            $('.vendedor-setted .codigo-vendedor').text(codValue)
            $('.vendedor-setted').show()
            $('.container-cod-coupon, .content-input-vendedor').hide()
          })
        }
      })
    })
    $('.mudar-vendedor').click((e) => {
      e.preventDefault()
      vtexjs.checkout.getOrderForm().then(function (orderForm) {
        let utms = {}
        if (orderForm?.marketingData) {
          utms = orderForm?.marketingData
        }
        delete utms.utmiCampaign
        vtexjs.checkout.sendAttachment('marketingData', utms)
      })

      vtexjs.checkout.sendAttachment('openTextField', { value: '' }).done(function (__orderForm) {
        $('.vendedor-error, .vendedor-setted .codigo-vendedor').text('')
        $('.content-input-vendedor, .vendedor-error').show()
        $('.vendedor-setted').hide()
      })
    })
  },
}

function checkMarketingData() {
  vtexjs.checkout.getOrderForm().done(function (orderForm) {
    const valueMarketingData = orderForm?.marketingData
    const valueUtmiCampaign = orderForm?.marketingData?.utmiCampaign

    if (valueMarketingData && valueUtmiCampaign !== null) {
      var showCoupon = setInterval(function () {
        if ($('.vendedor-setted').length) {
          clearInterval(showCoupon)

          let template = `
          <div class="container-cod-coupon">
            <p>${valueUtmiCampaign}</p>
          </div>`

          $(template).appendTo('.vendedor-setted')

          $('.add-vendedor-button, .content-input-vendedor').hide()
          $('.vendedor.summary-vendedor').show()
          $('.vendedor-setted').show()
        }
      }, 500)
    } else return null
  })
}

//Compartilhar carrinho
function shareCart() {
  vtexjs.checkout.getOrderForm().done(function (orderForm) {
    const orderFormId = orderForm?.orderFormId

    if (orderFormId != null) {
      var showBtnShareCart = setInterval(function () {
        if ($('.forms.coupon-column.summary-coupon-wrap.text-center').length) {
          clearInterval(showBtnShareCart)

          let btnShareCartHTML = `
          <div class="container-share-cart">
            <button>Compartilhar carrinho</button>
          </div>`

          $(btnShareCartHTML).insertAfter('.forms.coupon-column.summary-coupon-wrap.text-center')

          let shareCartModalHTML = `
          <div id="shareCartModal" class="modal-share-cart" style="display: none">
            <div class="overlay-modal-share-cart"></div>
            <div class="modal-content-share-cart">
              <div class="close-modal-share-cart-top">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 7.23985L1.50554 11.7343C1.32841 11.9114 1.12177 12 0.885609 12C0.649446 12 0.442804 11.9114 0.265683 11.7343C0.0885611 11.5572 0 11.3506 0 11.1144C0 10.8782 0.0885611 10.6716 0.265683 10.4945L4.76015 6L0.265683 1.50554C0.0885611 1.32841 0 1.12177 0 0.885609C0 0.649446 0.0885611 0.442804 0.265683 0.265683C0.442804 0.0885611 0.649446 0 0.885609 0C1.12177 0 1.32841 0.0885611 1.50554 0.265683L6 4.76015L10.4945 0.265683C10.6716 0.0885611 10.8782 0 11.1144 0C11.3506 0 11.5572 0.0885611 11.7343 0.265683C11.9114 0.442804 12 0.649446 12 0.885609C12 1.12177 11.9114 1.32841 11.7343 1.50554L7.23985 6L11.7343 10.4945C11.9114 10.6716 12 10.8782 12 11.1144C12 11.3506 11.9114 11.5572 11.7343 11.7343C11.5572 11.9114 11.3506 12 11.1144 12C10.8782 12 10.6716 11.9114 10.4945 11.7343L6 7.23985Z"
                    fill="black" />
                </svg>
              </div>
              <div> 
                <h2 class="title-modal-share-cart">Carrinho gerado com sucesso</h2>
              </div>
              <div>
                <p class="subtitle-modal-share-cart">Link para compartilhamento:</p>
              </div>
              <div class="content-copy-text-share-cart">
                <p class="copy-text-share-cart">
                  https://www.lfmaquinaseferramentas.com.br/checkout/?orderFormId=${orderFormId}#/cart
                </p>
                <div id="copyLinkBtnShareCart"></div>
                <span id="copyMessage"></span>
              </div>
              <div class="content-close-modal-share-cart">
                <button class="close-modal-share-cart" id="closeModalBtn">Fechar</button>
              </div>
            </div>
          </div>`

          $(shareCartModalHTML).appendTo('body')

          $('.container-share-cart button').on('click', function () {
            $('#shareCartModal, .overlay-modal-share-cart').css('display', 'block')
          })

          $('#closeModalBtn, .close-modal-share-cart, .close-modal-share-cart-top, .overlay-modal-share-cart').on(
            'click',
            function () {
              $('#shareCartModal, .overlay-modal-share-cart').css('display', 'none')
            }
          )

          $('#copyLinkBtnShareCart').on('click', function () {
            var textToCopy = $('.copy-text-share-cart').text()
            navigator.clipboard.writeText(textToCopy)
            $('#copyMessage').text('Link copiado!')
          })
        }
      }, 500)
    } else return null
  })
}

// Modal de ajuda
function floatHelpCheckout() {
  // Click Button ZenDesk
  $('.open-zen-desk').on('click', () => {
    $('.float-help-backdrop').toggleClass('open-float-help')
    $('.container-links').toggleClass('open-float-help')
    zE(() => {
      zE.activate()
    })
  })

  // Click Button Float
  $('.button-open-modal').on('click', () => {
    console.log('ENTROU AQUI Button Float')
    $('.float-help-backdrop').toggleClass('open-float-help')
    $('.container-links').toggleClass('open-float-help')
  })
  // Click Close Header
  $('.close-modal-float-help').on('click', () => {
    console.log('ENTROU AQUI Close Header ')
    $('.float-help-backdrop').toggleClass('open-float-help')
    $('.container-links').toggleClass('open-float-help')
  })
  // Click Back Drop modal float
  $('.float-help-backdrop').on('click', () => {
    console.log('ENTROU AQUI Back Drop modal float')
    $('.float-help-backdrop').toggleClass('open-float-help')
    $('.container-links').toggleClass('open-float-help')
  })
}

function replaceFooter() {
  const footer = $(`footer`)
  const newFooter = `
  <footer class="footer-checkout">
  <div class="footer-top">
    <div class="wrapper-top">
      <div class="footer-wrapper">
        <div class="footer-main-content">
          <div class="payment-flags-container-desktop">
            <div class="infos-container-mobile">
              <h3>Atendimento</h3>
              <div class="contacts-container">
                <span>
                  <strong>Telefone:</strong> (51) 3103-0100
                </span>
              </div>

              <div class="time-container">
                <span><strong>Horário de Atendimento:</strong></span>

                <span>Segunda a Quinta: 08:00 às 18:00</span>
                <span>Sexta-feira: 08:00 às 17:00</span>
              </div>
            </div>
            <ul class="payment-flags-list-desktop">
              <li class="payment-flag">
                <svg width="34" height="11" viewBox="0 0 34 11" fill="none" xmlns="http://www.w3.org/2000/svg" id="visa">
                  <path d="M24.3446 1.21683C23.8056 1.02137 22.9599 0.808594 21.9133 0.808594C19.2371 0.808594 17.3458 2.12392 17.3343 4.00631C17.3123 5.38985 18.675 6.16969 19.7049 6.63596C20.7631 7.11343 21.1168 7.4107 21.1116 7.83421C21.1064 8.48679 20.2659 8.77795 19.4925 8.77795C18.4176 8.77795 17.8346 8.63543 16.9355 8.26892L16.6017 8.1152L16.2207 10.2898C16.8748 10.5494 18.0471 10.7774 19.257 10.7988C22.108 10.7988 23.9668 9.49466 23.9877 7.484C24.0097 6.38144 23.2802 5.5446 21.726 4.85436C20.7882 4.40946 20.201 4.10608 20.201 3.64999C20.201 3.24684 20.7024 2.82333 21.749 2.82333C22.648 2.80704 23.2813 2.99843 23.7763 3.18881L24.0327 3.29978L24.4085 1.20564L24.3446 1.21683ZM31.3016 0.98879H29.2083C28.5542 0.98879 28.0685 1.15881 27.7797 1.79L23.7564 10.6603H26.6022L27.1758 9.20757L30.6474 9.21266C30.7343 9.55167 30.9792 10.6593 30.9792 10.6593H33.4922L31.3016 0.98879ZM13.4806 0.909381H16.1903L14.4948 10.585H11.7851L13.4806 0.90429V0.909381ZM6.59064 6.2379L6.86799 7.58479L9.52225 0.98879H12.3952L8.12081 10.6441H5.26037L2.91591 2.46803C2.86672 2.3255 2.80706 2.22878 2.65949 2.1453C1.86928 1.74215 0.980693 1.41332 0 1.18528L0.0324456 0.982681H4.40422C4.99348 1.00406 5.47283 1.18528 5.63611 1.80018L6.59063 6.24299L6.59064 6.2379ZM27.9482 7.22949L29.0335 4.52043C29.0168 4.54588 29.2565 3.96355 29.3925 3.59705L29.5778 4.42881L30.2058 7.22338H27.9482V7.22949Z" fill="#0066B2"></path>
                </svg>
              </li>
              <li class="payment-flag">
                <svg width="26" height="16" viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg" id="mastercard">
                  <circle cx="8" cy="8" r="8" fill="#EB001B"></circle>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4002 12.8006C13.9957 13.3389 13.525 13.8245 13 14.2454C14.3696 15.3433 16.1081 16 18 16C22.4183 16 26 12.4183 26 8C26 3.58172 22.4183 0 18 0C16.1081 0 14.3696 0.656718 13 1.75463C13.525 2.17546 13.9957 2.66111 14.4002 3.19944C15.4029 2.44629 16.6493 2 18 2C21.3137 2 24 4.68629 24 8C24 11.3137 21.3137 14 18 14C16.6493 14 15.4029 13.5537 14.4002 12.8006Z" fill="#F79E1B"></path>
                </svg>
              </li>
              <li class="payment-flag">
                <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg" id="dinners-club">
                  <path d="M9.34033 19.0892C4.19043 19.0892 0 15.0139 0 10.0035C0 4.99412 4.19043 0.917969 9.34033 0.917969H20.6062C25.7563 0.917969 29.9468 4.99412 29.9468 10.0035C29.9468 15.0139 25.7563 19.0892 20.6062 19.0892H9.34033ZM0.537842 10.006C0.537842 14.7268 4.48657 18.5675 9.34033 18.5675C14.1936 18.5675 18.1421 14.7268 18.1421 10.006C18.1421 5.28538 14.1936 1.44386 9.34033 1.44386C4.48657 1.44386 0.537842 5.28538 0.537842 10.006ZM11.4065 4.81625C13.5486 5.62343 15.0679 7.63995 15.0679 10.006C15.0679 12.3724 13.5466 14.3906 11.4065 15.196V4.81625ZM3.61499 10.006V10.0035C3.61499 7.63734 5.13403 5.61916 7.27515 4.81376V15.196C5.13672 14.3906 3.61499 12.3742 3.61499 10.006Z" fill="#2656A0"></path>
                </svg>
              </li>
              <li class="payment-flag">
                <svg width="33" height="13" viewBox="0 0 33 13" fill="none" xmlns="http://www.w3.org/2000/svg" id="elo">
                  <path d="M5.05038 3.50373C5.41434 3.38546 5.80344 3.32191 6.20859 3.32191C7.97528 3.32191 9.45029 4.5425 9.78815 6.16491L12.2925 5.668C11.7179 2.91094 9.21277 0.835938 6.20859 0.835938C5.5202 0.835938 4.85892 0.945065 4.24023 1.14613L5.05038 3.50373Z" fill="#FBC707"></path>
                  <path d="M2.09547 11.3985L3.78903 9.53605C3.03304 8.8846 2.55606 7.93383 2.55606 6.87456C2.55606 5.8153 3.03239 4.86579 3.78789 4.21513L2.09401 2.35254C0.810139 3.4588 0 5.0749 0 6.87456C0 8.67423 0.810464 10.2921 2.09547 11.3985Z" fill="#38A7E4"></path>
                  <path d="M9.78784 7.58691C9.44867 9.20852 7.9751 10.4268 6.20892 10.4268C5.80362 10.4268 5.41336 10.3632 5.04956 10.2443L4.23828 12.603C4.85712 12.8039 5.51971 12.9127 6.20892 12.9127C9.21017 12.9127 11.7148 10.8412 12.2918 8.0865L9.78784 7.58691Z" fill="#EF3120"></path>
                  <path d="M14.4829 9.61445C14.4008 9.48513 14.2894 9.27839 14.2222 9.12622C13.8256 8.23064 13.8066 7.30384 14.1415 6.4141C14.5098 5.43843 15.2132 4.6914 16.1221 4.31103C17.2648 3.83272 18.5285 3.92703 19.6237 4.55908C20.3193 4.94734 20.8125 5.54676 21.187 6.39439C21.2347 6.50288 21.2767 6.6188 21.3176 6.7172L14.4829 9.61445ZM16.7651 5.74878C15.9536 6.08798 15.5353 6.82837 15.6213 7.69651L19.0587 6.25751C18.4675 5.58192 17.6984 5.358 16.7651 5.74878ZM19.4875 8.87973C19.4867 8.88035 19.4862 8.88099 19.4855 8.88162L19.4144 8.83495C19.2093 9.15871 18.8892 9.42095 18.4854 9.59127C17.717 9.91628 17.005 9.83271 16.4937 9.39651L16.4467 9.46606C16.4467 9.46606 16.446 9.46463 16.4452 9.46463L15.5731 10.7336C15.7896 10.88 16.022 11.0039 16.2662 11.103C17.2296 11.4922 18.2151 11.4742 19.1861 11.0634C19.8884 10.7674 20.4395 10.3159 20.8161 9.74376L19.4875 8.87973Z" fill="#231F20"></path>
                  <path d="M23.7068 2.44238V9.49752L24.8344 9.94208L24.1936 11.3964L22.9489 10.8922C22.6694 10.7746 22.4792 10.5945 22.3353 10.3912C22.1976 10.184 22.0947 9.89966 22.0947 9.51677V2.44238H23.7068Z" fill="#231F20"></path>
                  <path d="M26.6283 7.69999C26.629 7.09915 26.9016 6.56043 27.3333 6.19427L26.1763 4.93945C25.3916 5.61409 24.8975 6.59985 24.8965 7.69824C24.8951 8.79695 25.3887 9.78381 26.1726 10.4602L27.3282 9.2041C26.8988 8.83637 26.6278 8.29941 26.6283 7.69999Z" fill="#231F20"></path>
                  <path d="M28.6838 9.7024C28.4561 9.70177 28.2367 9.66517 28.0321 9.59895L27.4795 11.1969C27.8572 11.3202 28.2616 11.3874 28.682 11.3881C30.5139 11.3898 32.0436 10.1255 32.3979 8.44476L30.6997 8.10742C30.5066 9.01879 29.6774 9.7032 28.6838 9.7024Z" fill="#231F20"></path>
                  <path d="M28.6887 4.01563C28.2688 4.01515 27.8644 4.08154 27.4873 4.20377L28.035 5.80315C28.2402 5.73722 28.4596 5.7008 28.6871 5.7008C29.6829 5.70175 30.5128 6.39041 30.7013 7.30397L32.3998 6.96886C32.0504 5.28588 30.5221 4.01689 28.6887 4.01563Z" fill="#231F20"></path>
                </svg>
              </li>
              <li class="payment-flag">
                <svg width="27" height="20" viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg" id="amex">
                  <path d="M2.48291 19.2504C1.11328 19.2504 0 18.1674 0 16.835V3.33321C0 2.00169 1.11328 0.917969 2.48291 0.917969H24.2964C25.6653 0.917969 26.7793 2.00169 26.7793 3.33321V16.835C26.7793 18.1674 25.6653 19.2504 24.2964 19.2504H2.48291ZM1.57837 3.64834V16.5199C1.57837 17.2789 2.21216 17.8951 2.99243 17.8951H23.7869C24.5662 17.8951 25.2007 17.2789 25.2007 16.5199V3.64834C25.2007 2.89032 24.5662 2.27312 23.7869 2.27312H2.99243C2.21216 2.27312 1.57837 2.89032 1.57837 3.64834ZM22.9309 12.7363L21.5684 11.0116L20.2048 12.7363H15.8418V7.43204H20.3418L21.4324 9.02349L22.7959 7.43204H24.2954L22.2515 10.0837L24.2954 12.7363H22.9309ZM16.9353 11.6753H19.5244L20.7522 10.0855L19.6614 8.62607H16.9353V9.55318H19.3887V10.6142H16.9353V11.6753ZM13.2532 12.7363V8.89133L11.7529 12.7363H10.6621L9.16187 8.75835V12.7363H6.84521L6.4375 11.543H4.11914L3.70972 12.7363H2.48218L4.52686 7.43204H6.0271L7.93604 12.471V7.43204H9.84399L11.2075 11.0116L12.571 7.43204H14.344V12.7363H13.2532ZM4.52686 10.349H5.89136L5.20898 8.49309L4.52686 10.349Z" fill="#1274B8"></path>
                </svg>
              </li>
              <li class="payment-flag">
                <svg width="36" height="16" viewBox="0 0 36 16" fill="none" xmlns="http://www.w3.org/2000/svg" id="hypercard">
                  <path d="M14.7653 15.5676L0 15.5726V15.5387C0 15.52 0.0235443 15.3989 0.0523376 15.2695C0.0812378 15.1402 0.125923 14.9343 0.151886 14.8122C0.177734 14.69 0.222046 14.4826 0.250183 14.3509C0.31955 14.0293 0.388107 13.7077 0.455803 13.3858C0.482399 13.2589 0.526772 13.0513 0.554543 12.9246C0.589859 12.7623 0.624809 12.6 0.659492 12.4376C0.689514 12.2966 0.735107 12.0814 0.760849 11.9592C0.786537 11.837 0.827591 11.6488 0.851776 11.5407C0.876022 11.4327 0.906944 11.2866 0.920441 11.2162C0.934029 11.1456 0.977859 10.9381 1.0179 10.7549C1.05161 10.6014 1.08437 10.4476 1.11609 10.2937C1.13007 10.2232 1.17442 10.0156 1.21473 9.83238C1.25497 9.64926 1.29918 9.44161 1.31293 9.37117C1.32668 9.30075 1.37121 9.09304 1.41177 8.90996C1.45234 8.72666 1.49617 8.52288 1.50907 8.45723C1.52208 8.39144 1.55751 8.22231 1.58795 8.0814C1.61824 7.94041 1.67583 7.67515 1.7157 7.49197C1.75568 7.30873 1.82386 6.98972 1.86726 6.78297C1.91082 6.57625 1.96284 6.33028 1.98285 6.23632C2.04182 5.96001 2.10123 5.6839 2.16122 5.40781C2.19077 5.27157 2.23888 5.04861 2.26815 4.91229C2.29736 4.77609 2.34244 4.56459 2.36829 4.44253C2.39403 4.32035 2.43813 4.11665 2.46611 3.98984C2.49415 3.86293 2.54243 3.63998 2.5733 3.49433C2.60424 3.34873 2.65604 3.12579 2.68842 2.99891C2.72074 2.87206 2.76646 2.71834 2.79011 2.65726C2.81365 2.59616 2.87878 2.46378 2.93476 2.36306L3.03649 2.17992L3.12902 2.06405C3.1798 2.00037 3.27064 1.8998 3.33078 1.84046C3.39094 1.78112 3.49236 1.69189 3.5563 1.64213C3.6201 1.59232 3.71262 1.52511 3.76176 1.49284C3.81088 1.46052 3.90738 1.40392 3.97625 1.36701C4.04502 1.3302 4.14162 1.28201 4.19075 1.25988C4.23988 1.23775 4.34038 1.19726 4.41407 1.16998C4.48771 1.14286 4.62857 1.09722 4.72678 1.06864C4.82503 1.04011 5.00962 0.997054 5.13688 0.973114C5.26403 0.94901 5.46505 0.916891 5.58362 0.901693L5.79908 0.873997L20.5735 0.868684L35.3479 0.863281V0.897211C35.3479 0.915852 35.3243 1.03694 35.2953 1.16634C35.2588 1.33001 35.223 1.49388 35.1878 1.6578C35.1575 1.79877 35.1135 2.00256 35.0898 2.11053C35.0563 2.26425 35.0231 2.41797 34.9902 2.5718C34.959 2.71751 34.9112 2.94051 34.8839 3.06722C34.8565 3.19413 34.8121 3.40172 34.7853 3.52859C34.7586 3.65539 34.714 3.86293 34.6863 3.98981C34.654 4.1378 34.6222 4.28584 34.5908 4.43399C34.566 4.55143 34.521 4.76278 34.491 4.90375C34.461 5.04466 34.4127 5.26762 34.3837 5.39921C34.3547 5.5307 34.3107 5.73444 34.2857 5.85189C34.2607 5.96927 34.2157 6.18073 34.1858 6.32164C34.1558 6.4626 34.1076 6.68552 34.0787 6.81711C34.0497 6.9487 34.0067 7.14855 33.9828 7.26131C33.9167 7.57458 33.8501 7.8878 33.7832 8.20091C33.7589 8.31362 33.7158 8.51362 33.6873 8.645C33.6508 8.81303 33.6145 8.98097 33.5787 9.14912C33.5474 9.29481 33.5029 9.50214 33.4796 9.61032C33.4561 9.71833 33.4125 9.92207 33.3825 10.0629C33.3472 10.2282 33.3118 10.3934 33.2761 10.5585C33.2478 10.69 33.2033 10.8976 33.1771 11.0198C33.1512 11.1419 33.1058 11.3533 33.0767 11.4895C33.0474 11.6257 32.9996 11.8486 32.9703 11.9849C32.9412 12.1212 32.8976 12.3249 32.8732 12.4377C32.8402 12.5914 32.8074 12.7451 32.7747 12.8988C32.7396 13.0636 32.7034 13.2281 32.6664 13.3925L32.6126 13.6297L32.5486 13.7938C32.5134 13.8842 32.4603 14.0042 32.4308 14.0605C32.4012 14.1169 32.3411 14.2164 32.2971 14.2816C32.2531 14.3468 32.1919 14.4302 32.1609 14.4671C32.13 14.5041 32.0369 14.5994 31.9539 14.6789L31.8034 14.8235L31.6583 14.922C31.5785 14.9762 31.4925 15.0314 31.4673 15.0445C31.442 15.0577 31.3459 15.1046 31.2537 15.1488C31.1615 15.1929 31.0313 15.2491 30.9644 15.2735C30.8974 15.2982 30.7647 15.3399 30.6695 15.3663C30.5742 15.3929 30.4722 15.4189 30.4427 15.4243C30.4132 15.4298 30.311 15.4499 30.2153 15.4693C30.1197 15.4886 29.9267 15.5176 29.7864 15.5335L29.5313 15.5625L14.7653 15.5676ZM9.51198 11.9165H9.89623L9.90705 11.8894C9.91307 11.8745 9.91796 11.8396 9.91796 11.8119C9.91796 11.7839 9.93064 11.6827 9.94611 11.5868C9.96152 11.4909 9.99787 11.2702 10.0268 11.0964C10.0558 10.9225 10.099 10.6613 10.123 10.5156C10.1458 10.3777 10.1676 10.2396 10.1882 10.1013C10.2 10.0191 10.2143 9.9518 10.2202 9.9518C10.2259 9.9518 10.2508 9.98813 10.2754 10.0326L10.32 10.1133L10.4191 10.2087L10.5183 10.3041L10.6401 10.3508L10.7621 10.3975L10.9073 10.4155L11.0528 10.4335L11.2372 10.4227L11.4216 10.4119L11.6214 10.3625L11.8211 10.313L11.9283 10.2663C11.9874 10.2406 12.0919 10.1845 12.1606 10.1416L12.2858 10.0638L12.4024 9.95222C12.4666 9.89111 12.5571 9.79272 12.6035 9.73396C12.6499 9.67508 12.6879 9.62264 12.6879 9.6174C12.6879 9.61214 12.7108 9.57576 12.7386 9.53644C12.7665 9.4972 12.8235 9.38809 12.8653 9.29419C12.9072 9.20018 12.9725 9.03109 13.0107 8.91834L13.08 8.71335L13.1157 8.53579C13.1355 8.43807 13.1608 8.27671 13.1721 8.17697L13.1925 7.99582L13.1807 7.84208L13.1688 7.68836L13.1316 7.53454L13.0943 7.38081L13.0339 7.26573L12.9736 7.15052L12.857 7.03241L12.7404 6.91419L12.6025 6.84605L12.4645 6.7778L12.3126 6.74303L12.1606 6.70831L12.0087 6.69769L11.8569 6.68702L11.6877 6.7056L11.5184 6.72409L11.3803 6.75781L11.2423 6.79144L11.1223 6.84464C11.0563 6.87374 10.9602 6.92335 10.9089 6.9548C10.8576 6.98619 10.8045 7.02232 10.7911 7.03511C10.7778 7.04781 10.7457 7.0715 10.7199 7.08758L10.6729 7.11695L10.7057 6.96682C10.7238 6.88431 10.7388 6.80727 10.7392 6.79544L10.74 6.77409H10.0847L10.0273 7.12007C9.99567 7.31043 9.94579 7.6044 9.9164 7.77357C9.85161 8.14667 9.78605 8.51964 9.71973 8.89251C9.69057 9.0569 9.64225 9.31838 9.61238 9.47335C9.58257 9.62842 9.5389 9.85518 9.51529 9.97746C9.49175 10.0996 9.44727 10.3301 9.41672 10.4899C9.3806 10.6778 9.34409 10.8658 9.30722 11.0536C9.27239 11.2304 9.2368 11.4068 9.20035 11.5832C9.17113 11.7241 9.14293 11.8568 9.13747 11.878L9.12767 11.9164L9.51198 11.9165ZM11.1661 9.94129L11.017 9.94989L10.9195 9.93338L10.8219 9.91702L10.7229 9.87377L10.6237 9.83047L10.5546 9.76733L10.4854 9.70423L10.4455 9.61881C10.4235 9.57179 10.3952 9.49194 10.3828 9.44135L10.36 9.34937L10.3692 9.20215L10.3784 9.05499L10.4243 8.82427C10.4591 8.64803 10.4927 8.4715 10.5254 8.29475C10.5556 8.13032 10.6015 7.88929 10.6272 7.75932L10.6739 7.52287L10.7764 7.44136C10.8328 7.39659 10.922 7.33647 10.9748 7.30795L11.0707 7.25593L11.1957 7.21893L11.3209 7.18187L11.4817 7.17286L11.6426 7.16379L11.7735 7.19055L11.9044 7.21721L11.997 7.25792L12.0894 7.29863L12.1668 7.37311L12.2444 7.4476L12.2861 7.52648C12.3092 7.56983 12.3414 7.6548 12.3579 7.71512L12.3878 7.82491L12.3787 8.14958L12.3695 8.47415L12.3236 8.66602C12.2984 8.77155 12.2504 8.93301 12.2169 9.0248L12.156 9.19173L12.0814 9.32676C12.0403 9.40105 11.9772 9.50152 11.9408 9.54995C11.9046 9.59839 11.8467 9.66117 11.8123 9.68933C11.7707 9.72323 11.728 9.75597 11.6843 9.78747L11.6188 9.83416L11.4672 9.88339L11.3155 9.93271L11.1661 9.94129ZM14.877 10.4108L15.0736 10.4131L15.2702 10.3959C15.3783 10.3865 15.5552 10.3668 15.6633 10.3523C15.7715 10.3378 15.9582 10.3051 16.0784 10.2799L16.2968 10.2339L16.3077 10.1569C16.3137 10.1146 16.3382 9.98861 16.3622 9.87673L16.4059 9.67367L16.3961 9.66445L16.3866 9.6553L16.3198 9.68605C16.283 9.70303 16.1686 9.74353 16.0655 9.77601L15.8781 9.83504L15.6812 9.87153L15.4846 9.90797L15.1718 9.90859L14.8591 9.90907L14.7518 9.87631C14.6928 9.85841 14.6061 9.82552 14.5591 9.80324L14.4736 9.76283L14.403 9.70183L14.3324 9.64083L14.2773 9.54879L14.2223 9.45665L14.1877 9.34134L14.1531 9.22584L14.1529 9.0122L14.1526 8.79856L14.1832 8.60803L14.214 8.41751L14.4828 8.40554L14.7517 8.39351L15.7458 8.39966L16.7398 8.40574L16.7698 8.28399C16.7864 8.21704 16.8116 8.07867 16.8259 7.97649L16.852 7.79071L16.8526 7.63448L16.8532 7.47821L16.8249 7.36145L16.7965 7.24484L16.7497 7.16759C16.7241 7.12511 16.6786 7.06353 16.6489 7.0307C16.6193 6.99794 16.5663 6.95173 16.5311 6.92804C16.496 6.90435 16.4272 6.86453 16.378 6.83953L16.2885 6.7941L16.1325 6.75818L15.9764 6.72231L15.7841 6.70472L15.5916 6.68707L15.4129 6.69816L15.2343 6.70935L15.0198 6.7487L14.8054 6.78812L14.6713 6.83928C14.5976 6.86739 14.485 6.91878 14.421 6.95345C14.3573 6.98806 14.2687 7.04443 14.2246 7.07869C14.1803 7.11294 14.1037 7.17957 14.0543 7.22674C14.005 7.27389 13.9318 7.35848 13.8921 7.41492C13.8522 7.47134 13.7911 7.57118 13.7562 7.63702C13.7213 7.70283 13.676 7.79503 13.6553 7.84204C13.6346 7.88898 13.5971 7.98509 13.5719 8.05557C13.5466 8.12606 13.507 8.26062 13.4838 8.35457C13.4565 8.46847 13.4329 8.58305 13.4131 8.69824L13.3847 8.87124L13.385 9.12541L13.3852 9.37956L13.4124 9.49064C13.4272 9.5517 13.4559 9.64399 13.4758 9.69568C13.4957 9.74727 13.5328 9.82426 13.5579 9.86644C13.5831 9.9087 13.6368 9.9769 13.6774 10.0178C13.7179 10.0587 13.7912 10.1208 13.8404 10.1558C13.8896 10.1906 13.977 10.2398 14.0347 10.2651L14.1398 10.3107L14.2863 10.3446C14.3669 10.3631 14.4885 10.3853 14.5566 10.3937C14.6247 10.402 14.7688 10.4098 14.877 10.4108ZM15.2135 8.00429C14.7188 8.00429 14.314 8.00097 14.314 7.99674C14.314 7.99252 14.3352 7.93302 14.361 7.86436C14.3867 7.79565 14.432 7.69347 14.4616 7.63724L14.5154 7.53491L14.6336 7.42257L14.7518 7.31008L14.8681 7.25703C14.9319 7.22776 15.0164 7.19597 15.0556 7.18634C15.095 7.17666 15.2076 7.16385 15.3058 7.15791L15.4847 7.14687L15.6219 7.16373L15.759 7.18061L15.8587 7.22433L15.9585 7.26795L16.0132 7.32434C16.0432 7.35536 16.079 7.40101 16.0928 7.42579L16.1178 7.47088L16.1343 7.57097L16.1509 7.67108L16.1319 7.83766L16.113 8.00423L15.2135 8.00429ZM20.5598 10.4109L20.7565 10.4131L20.9798 10.3878C21.1026 10.3739 21.266 10.3509 21.3431 10.3366C21.4361 10.3186 21.5286 10.2977 21.62 10.2737C21.6954 10.2533 21.7636 10.2314 21.7715 10.2248C21.7795 10.2182 21.8008 10.1407 21.8189 10.0525C21.8369 9.9643 21.8598 9.84592 21.8694 9.78955C21.8791 9.73316 21.8842 9.68414 21.8805 9.68034C21.877 9.67668 21.8638 9.68143 21.8513 9.69095C21.8388 9.70048 21.7511 9.73571 21.6565 9.76929L21.4843 9.83041L21.2393 9.8757L20.9943 9.92115L20.7859 9.91443L20.5775 9.90757L20.4592 9.8683L20.3408 9.82901L20.2494 9.75263L20.1579 9.67612L20.0973 9.5705L20.0367 9.46498L20.0077 9.32365L19.9789 9.18242L19.9791 8.99908L19.9792 8.81579L20.0143 8.59362L20.0494 8.37155L20.0865 8.25186C20.107 8.18612 20.13 8.10935 20.138 8.08112C20.1458 8.05292 20.1785 7.97219 20.2107 7.90175C20.243 7.83131 20.3005 7.72241 20.3385 7.65969L20.4076 7.54579L20.4926 7.46162L20.5777 7.37743L20.6676 7.32418L20.7575 7.27088L20.8731 7.23683C20.9367 7.21814 21.049 7.19383 21.1227 7.18291L21.2568 7.16287L21.4532 7.17234L21.6499 7.18181L21.8822 7.22626L22.1145 7.27067L22.209 7.3043C22.261 7.32289 22.3058 7.33802 22.3086 7.33802C22.3113 7.33802 22.3238 7.27457 22.3363 7.19701C22.3487 7.11955 22.3709 6.99202 22.3855 6.91373C22.4001 6.83527 22.4087 6.76776 22.4043 6.76369C22.3999 6.75953 22.3302 6.74901 22.2492 6.74016C22.1681 6.73138 21.948 6.7157 21.7597 6.70529L21.4177 6.68654L21.1764 6.70425L20.9351 6.72195L20.7564 6.75777L20.5777 6.79369L20.4626 6.83772C20.3992 6.86193 20.3065 6.90566 20.2566 6.93475C20.2087 6.96265 20.1615 6.9917 20.1151 7.02194C20.0872 7.04073 20.003 7.11409 19.9276 7.18493L19.7908 7.31373L19.7143 7.42074C19.6724 7.47962 19.5996 7.60222 19.5528 7.69341L19.4677 7.85916L19.4024 8.03849C19.3664 8.13713 19.3163 8.29855 19.291 8.39721L19.245 8.57664L19.2282 8.73895L19.2115 8.90127L19.2116 9.1148L19.2119 9.32838L19.2288 9.45254L19.2456 9.57684L19.2991 9.70469L19.3526 9.83244L19.4145 9.92474L19.4762 10.0172L19.5745 10.1096L19.6729 10.202L19.7769 10.2547L19.8809 10.3072L20.0176 10.3435C20.0925 10.3634 20.2012 10.3863 20.2587 10.3944C20.3162 10.4024 20.4516 10.4099 20.5598 10.4109ZM23.4994 10.4047L23.7406 10.3981L23.8925 10.3609L24.0444 10.3236L24.1428 10.2793C24.1968 10.2548 24.2852 10.2067 24.3394 10.1721C24.3935 10.1376 24.4771 10.0719 24.5253 10.0264C24.5734 9.98059 24.645 9.90266 24.6842 9.8531C24.7233 9.80354 24.7577 9.76525 24.7606 9.76789C24.7636 9.7707 24.7546 9.84972 24.7406 9.94347C24.7267 10.0373 24.7152 10.1621 24.715 10.2208L24.7146 10.3276H25.3706L25.3807 10.0841L25.3907 9.84068L25.4375 9.52463C25.4632 9.35076 25.5048 9.09325 25.5299 8.95234C25.555 8.81135 25.5984 8.57311 25.6268 8.42272C25.6549 8.27243 25.6996 8.03792 25.726 7.90169L25.774 7.65402L25.7756 7.44001L25.7772 7.22605L25.7267 7.12721L25.676 7.0283L25.6074 6.96537L25.5388 6.90232L25.4262 6.84782L25.3135 6.79312L25.1456 6.7574L24.9776 6.72163L24.7464 6.70493L24.5152 6.68811L24.2175 6.70576C24.0536 6.71544 23.8231 6.73455 23.7052 6.74824L23.4907 6.77307L23.3446 6.77365L23.1985 6.77421L23.1773 6.87254C23.1656 6.92648 23.133 7.05485 23.105 7.15777C23.0769 7.26067 23.0567 7.34724 23.0599 7.35021C23.0629 7.35339 23.1412 7.33627 23.2335 7.31257C23.3259 7.28879 23.5222 7.24974 23.6696 7.2257L23.9375 7.18202L24.1788 7.17259L24.4201 7.16298L24.5755 7.18899L24.7308 7.21512L24.8345 7.26401L24.9383 7.313L24.9963 7.3957L25.0544 7.47848L25.0536 7.60892L25.0527 7.73943L25.022 7.88259L24.9912 8.02574L24.3482 8.02798L23.7051 8.03016L23.4947 8.08539C23.3789 8.11574 23.2508 8.15598 23.2099 8.17487C23.169 8.19377 23.128 8.20929 23.1189 8.20929C23.1099 8.20929 23.041 8.24567 22.966 8.29044L22.8295 8.37149L22.7221 8.47411C22.6629 8.53042 22.5874 8.61502 22.5542 8.66207C22.5211 8.70903 22.4671 8.80703 22.4344 8.88013L22.3751 9.01272L22.3476 9.16197L22.3202 9.31105V9.62422L22.3463 9.75456L22.3724 9.88476L22.4208 9.96988C22.4474 10.0166 22.4963 10.0851 22.5293 10.1221L22.5896 10.1891L22.6963 10.2512L22.8032 10.3134L22.9256 10.3464C22.9929 10.3645 23.0953 10.3866 23.1532 10.3954L23.2585 10.4112L23.4994 10.4047ZM23.7228 9.92688L23.5798 9.93415L23.4851 9.9111C23.433 9.89838 23.3541 9.87018 23.3096 9.84826L23.2286 9.80854L23.1844 9.75832C23.1601 9.73062 23.1231 9.67648 23.1019 9.63786L23.0636 9.56752L23.0562 9.40319L23.0485 9.239L23.0789 9.13943C23.0955 9.08461 23.1345 8.9895 23.1658 8.92812L23.2223 8.81641L23.3307 8.71365L23.4389 8.61075L23.554 8.55776L23.669 8.50486L23.812 8.47233L23.9549 8.43985H24.8485L24.8767 8.45104L24.9049 8.46217L24.8811 8.59627C24.8681 8.66998 24.8369 8.8034 24.8118 8.89257C24.7867 8.9819 24.7425 9.11302 24.7135 9.18429C24.6845 9.2553 24.6608 9.31819 24.6608 9.32396C24.6608 9.32973 24.6314 9.38153 24.5954 9.43906L24.5302 9.54389L24.4231 9.64541C24.3642 9.70106 24.3095 9.74675 24.3015 9.74675C24.2935 9.74675 24.2575 9.76604 24.2213 9.7895L24.1554 9.83219L24.0105 9.87602L23.8655 9.91984L23.7228 9.92688ZM29.5396 10.4108L29.7093 10.4128L29.8702 10.3878C29.9587 10.3742 30.0712 10.3521 30.1204 10.3387C30.1695 10.3254 30.2581 10.291 30.317 10.2621L30.4242 10.2096L30.5165 10.132L30.6088 10.0543L30.7059 9.93041C30.7593 9.86238 30.8077 9.79513 30.8134 9.78101L30.8237 9.75539L30.8146 9.84083C30.8083 9.89798 30.8001 9.95498 30.79 10.0117C30.7813 10.0587 30.7689 10.149 30.7625 10.2123L30.7506 10.3277H31.4518V10.097L31.5051 9.66138C31.5345 9.42171 31.578 9.10277 31.6016 8.95244C31.6253 8.80209 31.662 8.58689 31.6832 8.47415C31.704 8.3614 31.7413 8.15764 31.7658 8.02141C31.7903 7.88524 31.8345 7.64689 31.864 7.49185C31.8936 7.33678 31.941 7.09081 31.9692 6.94511C31.9975 6.79952 32.0414 6.57271 32.0669 6.44121C32.0923 6.30967 32.1379 6.07894 32.1681 5.92867C32.1998 5.77183 32.2325 5.61524 32.2663 5.45881C32.2901 5.35078 32.3096 5.25662 32.3096 5.24959V5.23674H31.5445L31.5333 5.34351C31.5271 5.40233 31.4979 5.59629 31.4682 5.7749C31.4332 5.98572 31.3975 6.19639 31.361 6.407C31.34 6.52846 31.319 6.64995 31.2984 6.77151L31.2887 6.82845L31.2586 6.81622C31.2419 6.8094 31.152 6.78551 31.0587 6.76311L30.8889 6.72235L30.6567 6.70508L30.4242 6.6878L30.2275 6.70529L30.031 6.72283L29.8523 6.76604L29.6736 6.8092L29.5038 6.88836L29.334 6.96755L29.2089 7.05604L29.0839 7.14453L28.9758 7.25531C28.9164 7.31627 28.8306 7.41694 28.785 7.47925L28.7024 7.59227L28.6052 7.7855C28.5518 7.8918 28.4868 8.03266 28.4608 8.09835C28.4348 8.1642 28.3888 8.30991 28.3587 8.42235L28.3041 8.62676L28.2771 8.89236L28.2501 9.15764L28.2704 9.37122L28.2907 9.58481L28.3146 9.66165C28.3277 9.70401 28.3555 9.77939 28.3762 9.82905L28.4138 9.91964L28.4827 10.0086L28.5515 10.0977L28.6301 10.1592L28.7086 10.2207L28.8158 10.2716C28.8749 10.2995 28.9737 10.3358 29.0357 10.3519C29.0976 10.3681 29.198 10.3877 29.2591 10.3953C29.32 10.4025 29.4462 10.4097 29.5396 10.4108ZM29.8443 9.92614L29.7093 9.93285L29.6184 9.91735C29.5683 9.9087 29.4882 9.88553 29.4402 9.86592L29.3532 9.8303L29.2799 9.77289L29.2068 9.71547L29.1523 9.61579L29.098 9.51615L29.0729 9.40512L29.0482 9.29408L29.0503 9.07195L29.0524 8.8499L29.0812 8.65331L29.11 8.45698L29.1547 8.32033C29.1795 8.24515 29.1997 8.17419 29.1998 8.1627C29.2 8.15114 29.2243 8.08977 29.2538 8.02605C29.2885 7.95245 29.3251 7.87966 29.3638 7.80778C29.3945 7.7514 29.4521 7.66354 29.4916 7.61253C29.5313 7.56152 29.6017 7.48462 29.6484 7.44162C29.6949 7.39877 29.769 7.34246 29.8131 7.31659L29.893 7.26957L30.0335 7.22309L30.174 7.17645L30.4689 7.17633H30.7639L30.9336 7.22138C31.0269 7.24621 31.1262 7.27484 31.1539 7.28525L31.2045 7.30404L31.1946 7.35089C31.1892 7.37664 31.1678 7.49002 31.1473 7.60274C31.1269 7.71554 31.0863 7.93084 31.0574 8.08112C31.0284 8.23142 30.9841 8.45827 30.9586 8.58508C30.9333 8.712 30.8966 8.87342 30.877 8.94385C30.8569 9.01626 30.8364 9.0885 30.8157 9.16081C30.8014 9.2096 30.7677 9.29419 30.7408 9.34869C30.7137 9.40313 30.6663 9.48237 30.6356 9.52468C30.6047 9.56696 30.5527 9.62561 30.5197 9.65482C30.4869 9.68419 30.4158 9.73625 30.3617 9.77055L30.2634 9.83306L30.1213 9.87612L29.9793 9.91922L29.8443 9.92614ZM3.54346 10.3277H3.97758L4.00878 10.1441C4.02586 10.043 4.05936 9.84893 4.08311 9.71277L4.18137 9.149C4.21167 8.97512 4.25716 8.71757 4.28237 8.57664C4.30753 8.43573 4.34764 8.2171 4.3713 8.09085C4.39511 7.96447 4.41904 7.85692 4.42455 7.85161L4.43462 7.84204H6.76961L6.78261 7.85443L6.79561 7.86681L6.77535 7.96541C6.76426 8.0197 6.7313 8.1871 6.70224 8.33738C6.67307 8.48773 6.62415 8.74146 6.59333 8.90121C6.56099 9.06931 6.52814 9.23734 6.49469 9.40518C6.47115 9.52265 6.4234 9.76851 6.38868 9.9518C6.35399 10.1351 6.32564 10.2946 6.32575 10.3064L6.32596 10.3277H7.1979L7.21717 10.2209C7.22783 10.1622 7.24491 10.0565 7.25518 9.98604C7.26534 9.91557 7.29012 9.76565 7.31008 9.65294C7.33004 9.54015 7.36986 9.31715 7.39865 9.15743C7.42739 8.99768 7.47565 8.72479 7.50573 8.55099C7.53582 8.37713 7.58043 8.12345 7.60501 7.98727C7.63599 7.81615 7.66832 7.64538 7.70188 7.47474C7.73067 7.32897 7.77868 7.08311 7.80858 6.92799C7.8385 6.77303 7.88318 6.5385 7.90792 6.40696C7.9328 6.27547 7.97803 6.03715 8.00852 5.8774C8.03897 5.71764 8.07756 5.53122 8.09404 5.46308L8.12418 5.33913H7.24132L7.22933 5.42039C7.22274 5.46491 7.20145 5.59006 7.18196 5.69796C7.16243 5.80613 7.12705 5.99822 7.10324 6.12507C7.07943 6.25199 7.03597 6.49404 7.00653 6.66328C6.97774 6.82898 6.95002 6.99478 6.92336 7.16078L6.89356 7.35073L6.24558 7.36329L5.59754 7.37581L5.05483 7.36354C4.75631 7.35673 4.51041 7.34981 4.50837 7.3483C4.50628 7.34657 4.51645 7.2802 4.53084 7.20066C4.5499 7.09816 4.57012 6.99587 4.59163 6.89384C4.61904 6.76292 4.64563 6.63199 4.6715 6.50082C4.69649 6.37401 4.72474 6.21644 4.73442 6.15065C4.74395 6.08488 4.76412 5.97537 4.77906 5.90711C4.79404 5.83903 4.8225 5.69557 4.8423 5.58838C4.86205 5.4811 4.88315 5.38114 4.88915 5.36622L4.89995 5.33909H4.0242L3.99627 5.48864C3.9808 5.57089 3.9602 5.68813 3.95051 5.74913C3.94082 5.81024 3.90817 6.00625 3.87799 6.18478C3.84791 6.36334 3.80328 6.62857 3.77904 6.77415L3.68099 7.36354C3.64648 7.56875 3.61015 7.77384 3.57192 7.97853C3.54014 8.14661 3.50776 8.3146 3.47469 8.48252C3.45141 8.59988 3.40714 8.82292 3.37626 8.97794C3.34383 9.14042 3.31045 9.30272 3.27604 9.46487C3.25179 9.57752 3.22503 9.70824 3.21664 9.75524C3.20807 9.80225 3.1804 9.9377 3.15509 10.0564C3.12977 10.1749 3.10906 10.2845 3.10906 10.2999V10.3276L3.54346 10.3277ZM8.35018 10.3277H8.73455L8.7454 10.3006C8.75139 10.2857 8.75628 10.2467 8.75628 10.2141C8.75628 10.1813 8.78046 10.0109 8.80996 9.8353C8.87737 9.43541 8.94648 9.03583 9.01732 8.63641C9.04761 8.46816 9.07961 8.30017 9.1131 8.13241C9.14159 7.9915 9.18531 7.77238 9.21025 7.64553C9.23508 7.51867 9.28415 7.27738 9.31916 7.10923C9.35411 6.9411 9.38712 6.7968 9.39248 6.78858L9.40221 6.77359L9.01346 6.77812L8.62477 6.78275L8.59235 7.00498C8.57457 7.12709 8.53562 7.36927 8.50586 7.54301C8.47611 7.71689 8.4311 7.98218 8.40574 8.13241C8.37517 8.31215 8.34253 8.49149 8.30779 8.67055C8.27921 8.81621 8.23543 9.03911 8.21045 9.16602C8.18552 9.29298 8.14072 9.51582 8.11097 9.66143C8.08115 9.80715 8.04122 9.99928 8.02217 10.0885C8.00307 10.1779 7.98258 10.2682 7.97663 10.2892L7.96581 10.3277H8.35018ZM17.3405 10.3277H17.722L17.7334 10.1734C17.7398 10.0885 17.7613 9.9175 17.7814 9.7932C17.8015 9.66904 17.8427 9.42135 17.8729 9.24289C17.9111 9.02225 17.9525 8.80205 17.9975 8.58249C18.0359 8.39783 18.0792 8.21422 18.0939 8.17462C18.1085 8.1349 18.1205 8.09195 18.1205 8.0791C18.1205 8.06618 18.1492 7.99601 18.1843 7.92319C18.2193 7.85035 18.2847 7.73881 18.3295 7.67524L18.4109 7.55978L18.5199 7.46326L18.6289 7.36677L18.7634 7.30539L18.8979 7.24401L19.1034 7.24505L19.309 7.24615L19.41 7.27493C19.4655 7.29087 19.5158 7.30387 19.5217 7.30387C19.5274 7.30387 19.5323 7.28566 19.5323 7.26349C19.5323 7.24136 19.5524 7.12881 19.577 7.01341C19.6016 6.89812 19.6216 6.79888 19.6216 6.793C19.6216 6.78702 19.5633 6.76514 19.492 6.74442C19.4208 6.72376 19.3223 6.70211 19.2732 6.69628L19.1837 6.68571L19.0677 6.70535C19.0038 6.71612 18.9088 6.73996 18.8567 6.75838C18.8044 6.77665 18.7181 6.81831 18.6649 6.85072C18.6118 6.88336 18.5291 6.94672 18.4812 6.99153C18.4333 7.03648 18.3527 7.12709 18.3021 7.19284C18.2627 7.24395 18.2235 7.29519 18.1846 7.34656L18.159 7.38071L18.1745 7.31242C18.183 7.27472 18.2068 7.15171 18.2273 7.03907C18.2478 6.92632 18.269 6.82054 18.2742 6.80413L18.2838 6.77421H17.6023V6.81539C17.6023 6.83808 17.5821 6.97446 17.5576 7.11855C17.533 7.2628 17.4925 7.50366 17.4675 7.65406C17.4425 7.80435 17.3982 8.06581 17.3691 8.2349C17.338 8.41449 17.3051 8.59387 17.2706 8.77294C17.2033 9.11491 17.1345 9.45659 17.0642 9.79798C17.0341 9.9437 16.9981 10.1157 16.9843 10.1803C16.9702 10.2447 16.9589 10.3042 16.9589 10.3126V10.3276L17.3405 10.3277ZM26.3977 10.3277H26.7878V10.0994L26.8328 9.81631C26.8576 9.66076 26.8984 9.41408 26.9235 9.26852C26.9486 9.12286 26.9799 8.93837 26.993 8.85842C27.0062 8.77857 27.041 8.6057 27.0705 8.47411C27.1 8.34255 27.1367 8.20028 27.1523 8.15801C27.1677 8.1158 27.1806 8.07139 27.1807 8.05948C27.1809 8.04754 27.2141 7.97078 27.2545 7.88894L27.3282 7.74L27.4254 7.61663L27.5225 7.49326L27.6287 7.41684C27.6873 7.37473 27.7812 7.31903 27.8377 7.2929L27.9404 7.24536L28.1638 7.24683L28.3871 7.24833L28.4751 7.27536L28.5631 7.30237L28.5778 7.29351L28.5926 7.28477L28.5935 7.23027C28.5938 7.20024 28.6129 7.08873 28.6359 6.98232L28.6776 6.78889L28.6308 6.77135C28.5856 6.7553 28.5402 6.74054 28.4943 6.7269L28.4051 6.69993L28.2442 6.7004L28.0834 6.70076L27.9523 6.74491L27.8212 6.78894L27.7229 6.84574L27.6243 6.90252L27.4964 7.03064L27.3684 7.15875L27.2996 7.25817C27.2619 7.31278 27.2286 7.35505 27.2257 7.35204C27.2227 7.34911 27.2434 7.23521 27.2714 7.09899C27.2994 6.96271 27.3227 6.83392 27.3231 6.81279L27.3239 6.77438H26.6627V6.78526C26.6627 6.79122 26.6462 6.90086 26.626 7.02876C26.6059 7.15667 26.5654 7.40352 26.5362 7.57739C26.501 7.7853 26.4654 7.9931 26.4294 8.20091C26.3979 8.3806 26.3651 8.55993 26.3307 8.73912C26.3058 8.86591 26.2618 9.08883 26.2327 9.23453C26.2037 9.38018 26.1559 9.61469 26.1267 9.7556L26.0404 10.1699L26.0075 10.3278L26.3977 10.3277ZM9.10636 6.15891L9.21474 6.15927L9.30101 6.13122L9.38729 6.10311L9.46364 6.02904L9.53997 5.95511L9.5801 5.85641L9.62035 5.75777L9.62174 5.61259L9.62323 5.46746L9.5875 5.41066L9.55179 5.35392L9.4896 5.31721L9.42727 5.28031H9.1586L9.06714 5.31947L8.97574 5.35861L8.92264 5.413L8.86956 5.46746L8.82781 5.56141L8.78612 5.65532L8.77826 5.80171L8.77044 5.94804L8.80919 6.02081L8.84798 6.09347L8.92296 6.12601L8.99778 6.15844L9.10636 6.15891Z" fill="#B3131B"></path>
                </svg>
              </li>
              <li class="payment-flag">
                <svg width="37" height="24" viewBox="0 0 37 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="boleto-bancario">
                  <path d="M33.7772 24H2.51088C1.12428 23.9981 0.000946045 22.9047 0 21.556L1.52588e-05 2.44235C0.00190735 1.09423 1.12495 0.00184044 2.51088 0L33.7772 2.96845e-05C35.1632 0.00184044 36.2862 1.09426 36.2881 2.44235L36.2881 21.556C36.2871 22.9047 35.1639 23.9982 33.7772 24ZM2.51089 1.39832C1.91907 1.39832 1.43929 1.86499 1.43929 2.44066L1.43927 21.556C1.43929 22.1317 1.91905 22.5983 2.51089 22.5983H33.7772C34.3691 22.5983 34.8489 22.1317 34.8489 21.556V2.44235C34.8489 1.86668 34.3691 1.39998 33.7772 1.39998L2.51089 1.39832Z" fill="black"></path>
                  <rect x="30.251" y="3.62793" width="2.308" height="16.8315" fill="black"></rect>
                  <rect x="26.7979" y="3.62793" width="2.308" height="14.5865" fill="black"></rect>
                  <rect x="9.49414" y="3.62793" width="2.308" height="14.5865" fill="black"></rect>
                  <rect x="21.0166" y="3.62793" width="2.308" height="14.5865" fill="black"></rect>
                  <rect x="15.2549" y="3.62793" width="3.37963" height="14.5865" fill="black"></rect>
                  <rect x="7.22266" y="3.62793" width="1.10805" height="14.5865" fill="black"></rect>
                  <rect x="12.9834" y="3.62793" width="1.10805" height="14.5865" fill="black"></rect>
                  <rect x="24.4902" y="3.62793" width="1.10805" height="14.5865" fill="black"></rect>
                  <rect x="3.71289" y="3.62793" width="2.308" height="16.8315" fill="black"></rect>
                </svg>
              </li>
              <li class="payment-flag">
                <svg width="73" height="22" viewBox="0 0 73 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.25415" width="72" height="22" rx="2" fill="#FAFAFA"/>
                  <path d="M7.23516 9.5V5.165H5.55516V4.2125H10.0852V5.165H8.40516V9.5H7.23516ZM10.0464 9.5V6.7025C10.0464 6.5375 10.0414 6.37 10.0314 6.2C10.0264 6.03 10.0139 5.8625 9.99387 5.6975H11.0814L11.2089 6.8075H11.0364C11.0864 6.5375 11.1664 6.315 11.2764 6.14C11.3914 5.965 11.5314 5.835 11.6964 5.75C11.8664 5.665 12.0589 5.6225 12.2739 5.6225C12.3689 5.6225 12.4439 5.6275 12.4989 5.6375C12.5539 5.6425 12.6089 5.655 12.6639 5.675L12.6564 6.6725C12.5514 6.6275 12.4614 6.6 12.3864 6.59C12.3164 6.575 12.2264 6.5675 12.1164 6.5675C11.9064 6.5675 11.7314 6.6075 11.5914 6.6875C11.4564 6.7675 11.3539 6.885 11.2839 7.04C11.2189 7.195 11.1864 7.3825 11.1864 7.6025V9.5H10.0464ZM14.5782 9.5825C14.2482 9.5825 13.9582 9.5025 13.7082 9.3425C13.4582 9.1825 13.2632 8.955 13.1232 8.66C12.9832 8.365 12.9132 8.01 12.9132 7.595C12.9132 7.185 12.9832 6.8325 13.1232 6.5375C13.2632 6.2425 13.4582 6.0175 13.7082 5.8625C13.9582 5.7025 14.2482 5.6225 14.5782 5.6225C14.8832 5.6225 15.1557 5.6975 15.3957 5.8475C15.6407 5.9925 15.8007 6.19 15.8757 6.44H15.7932L15.8832 5.6975H16.9707C16.9557 5.8625 16.9407 6.03 16.9257 6.2C16.9157 6.365 16.9107 6.5275 16.9107 6.6875V9.5H15.7857L15.7782 8.7875H15.8682C15.7882 9.0275 15.6282 9.22 15.3882 9.365C15.1482 9.51 14.8782 9.5825 14.5782 9.5825ZM14.9232 8.7275C15.1832 8.7275 15.3932 8.635 15.5532 8.45C15.7132 8.265 15.7932 7.98 15.7932 7.595C15.7932 7.21 15.7132 6.9275 15.5532 6.7475C15.3932 6.5675 15.1832 6.4775 14.9232 6.4775C14.6632 6.4775 14.4532 6.5675 14.2932 6.7475C14.1332 6.9275 14.0532 7.21 14.0532 7.595C14.0532 7.98 14.1307 8.265 14.2857 8.45C14.4457 8.635 14.6582 8.7275 14.9232 8.7275ZM17.8395 9.5V6.6875C17.8395 6.5275 17.8345 6.365 17.8245 6.2C17.8145 6.03 17.7995 5.8625 17.7795 5.6975H18.867L18.9495 6.4025H18.8595C18.9845 6.1525 19.162 5.96 19.392 5.825C19.622 5.69 19.8895 5.6225 20.1945 5.6225C20.6395 5.6225 20.972 5.7525 21.192 6.0125C21.417 6.2675 21.5295 6.665 21.5295 7.205V9.5H20.397V7.2575C20.397 6.9825 20.347 6.7875 20.247 6.6725C20.147 6.5575 19.997 6.5 19.797 6.5C19.547 6.5 19.347 6.58 19.197 6.74C19.047 6.895 18.972 7.105 18.972 7.37V9.5H17.8395ZM23.8416 9.5825C23.5016 9.5825 23.1916 9.545 22.9116 9.47C22.6316 9.395 22.3941 9.29 22.1991 9.155L22.4916 8.405C22.6866 8.525 22.9016 8.62 23.1366 8.69C23.3766 8.76 23.6141 8.795 23.8491 8.795C24.0691 8.795 24.2316 8.76 24.3366 8.69C24.4416 8.62 24.4941 8.525 24.4941 8.405C24.4941 8.305 24.4591 8.2275 24.3891 8.1725C24.3241 8.1175 24.2216 8.0775 24.0816 8.0525L23.3091 7.91C22.9841 7.845 22.7366 7.725 22.5666 7.55C22.3966 7.375 22.3116 7.1475 22.3116 6.8675C22.3116 6.6225 22.3766 6.4075 22.5066 6.2225C22.6416 6.0325 22.8341 5.885 23.0841 5.78C23.3341 5.675 23.6266 5.6225 23.9616 5.6225C24.2466 5.6225 24.5166 5.6575 24.7716 5.7275C25.0266 5.7975 25.2441 5.905 25.4241 6.05L25.1166 6.7775C24.9616 6.6625 24.7816 6.57 24.5766 6.5C24.3766 6.43 24.1841 6.395 23.9991 6.395C23.7591 6.395 23.5866 6.435 23.4816 6.515C23.3766 6.59 23.3241 6.6875 23.3241 6.8075C23.3241 6.8975 23.3541 6.9725 23.4141 7.0325C23.4791 7.0925 23.5766 7.1375 23.7066 7.1675L24.4866 7.31C24.8216 7.37 25.0766 7.4825 25.2516 7.6475C25.4266 7.8125 25.5141 8.04 25.5141 8.33C25.5141 8.595 25.4441 8.82 25.3041 9.005C25.1641 9.19 24.9666 9.3325 24.7116 9.4325C24.4616 9.5325 24.1716 9.5825 23.8416 9.5825ZM26.5034 9.5V6.545H25.7834V5.6975H26.8259L26.5034 5.99V5.4425C26.5034 4.9475 26.6309 4.575 26.8859 4.325C27.1459 4.075 27.5334 3.95 28.0484 3.95C28.1634 3.95 28.2859 3.9575 28.4159 3.9725C28.5509 3.9875 28.6684 4.0175 28.7684 4.0625V4.9325C28.6984 4.9075 28.6184 4.89 28.5284 4.88C28.4384 4.865 28.3509 4.8575 28.2659 4.8575C28.1509 4.8575 28.0434 4.8775 27.9434 4.9175C27.8484 4.9575 27.7709 5.025 27.7109 5.12C27.6559 5.21 27.6284 5.3325 27.6284 5.4875V5.885L27.4709 5.6975H28.5884V6.545H27.6359V9.5H26.5034ZM30.9361 9.5825C30.2761 9.5825 29.7611 9.405 29.3911 9.05C29.0211 8.695 28.8361 8.2125 28.8361 7.6025C28.8361 7.2075 28.9136 6.8625 29.0686 6.5675C29.2286 6.2725 29.4486 6.0425 29.7286 5.8775C30.0136 5.7075 30.3461 5.6225 30.7261 5.6225C31.1011 5.6225 31.4136 5.7025 31.6636 5.8625C31.9186 6.0225 32.1086 6.2475 32.2336 6.5375C32.3636 6.8225 32.4286 7.155 32.4286 7.535V7.7975H29.7661V7.235H31.6036L31.4761 7.34C31.4761 7.025 31.4111 6.7875 31.2811 6.6275C31.1561 6.4625 30.9736 6.38 30.7336 6.38C30.4686 6.38 30.2636 6.4775 30.1186 6.6725C29.9786 6.8675 29.9086 7.1475 29.9086 7.5125V7.6325C29.9086 8.0025 29.9986 8.2775 30.1786 8.4575C30.3636 8.6375 30.6286 8.7275 30.9736 8.7275C31.1786 8.7275 31.3711 8.7025 31.5511 8.6525C31.7361 8.5975 31.9111 8.5125 32.0761 8.3975L32.3911 9.1475C32.2011 9.2875 31.9811 9.395 31.7311 9.47C31.4861 9.545 31.2211 9.5825 30.9361 9.5825ZM33.1396 9.5V6.7025C33.1396 6.5375 33.1346 6.37 33.1246 6.2C33.1196 6.03 33.1071 5.8625 33.0871 5.6975H34.1746L34.3021 6.8075H34.1296C34.1796 6.5375 34.2596 6.315 34.3696 6.14C34.4846 5.965 34.6246 5.835 34.7896 5.75C34.9596 5.665 35.1521 5.6225 35.3671 5.6225C35.4621 5.6225 35.5371 5.6275 35.5921 5.6375C35.6471 5.6425 35.7021 5.655 35.7571 5.675L35.7496 6.6725C35.6446 6.6275 35.5546 6.6 35.4796 6.59C35.4096 6.575 35.3196 6.5675 35.2096 6.5675C34.9996 6.5675 34.8246 6.6075 34.6846 6.6875C34.5496 6.7675 34.4471 6.885 34.3771 7.04C34.3121 7.195 34.2796 7.3825 34.2796 7.6025V9.5H33.1396ZM38.0772 9.5825C37.4172 9.5825 36.9022 9.405 36.5322 9.05C36.1622 8.695 35.9772 8.2125 35.9772 7.6025C35.9772 7.2075 36.0547 6.8625 36.2097 6.5675C36.3697 6.2725 36.5897 6.0425 36.8697 5.8775C37.1547 5.7075 37.4872 5.6225 37.8672 5.6225C38.2422 5.6225 38.5547 5.7025 38.8047 5.8625C39.0597 6.0225 39.2497 6.2475 39.3747 6.5375C39.5047 6.8225 39.5697 7.155 39.5697 7.535V7.7975H36.9072V7.235H38.7447L38.6172 7.34C38.6172 7.025 38.5522 6.7875 38.4222 6.6275C38.2972 6.4625 38.1147 6.38 37.8747 6.38C37.6097 6.38 37.4047 6.4775 37.2597 6.6725C37.1197 6.8675 37.0497 7.1475 37.0497 7.5125V7.6325C37.0497 8.0025 37.1397 8.2775 37.3197 8.4575C37.5047 8.6375 37.7697 8.7275 38.1147 8.7275C38.3197 8.7275 38.5122 8.7025 38.6922 8.6525C38.8772 8.5975 39.0522 8.5125 39.2172 8.3975L39.5322 9.1475C39.3422 9.2875 39.1222 9.395 38.8722 9.47C38.6272 9.545 38.3622 9.5825 38.0772 9.5825ZM36.5547 5.3375L37.3872 3.8H38.3472L39.1797 5.3375H38.4822L37.8672 4.415L37.2522 5.3375H36.5547ZM40.2882 9.5V6.6875C40.2882 6.5275 40.2832 6.365 40.2732 6.2C40.2632 6.03 40.2482 5.8625 40.2282 5.6975H41.3157L41.3982 6.4025H41.3082C41.4332 6.1525 41.6107 5.96 41.8407 5.825C42.0707 5.69 42.3382 5.6225 42.6432 5.6225C43.0882 5.6225 43.4207 5.7525 43.6407 6.0125C43.8657 6.2675 43.9782 6.665 43.9782 7.205V9.5H42.8457V7.2575C42.8457 6.9825 42.7957 6.7875 42.6957 6.6725C42.5957 6.5575 42.4457 6.5 42.2457 6.5C41.9957 6.5 41.7957 6.58 41.6457 6.74C41.4957 6.895 41.4207 7.105 41.4207 7.37V9.5H40.2882ZM46.7179 9.5825C46.3129 9.5825 45.9579 9.5025 45.6529 9.3425C45.3479 9.1825 45.1129 8.9525 44.9479 8.6525C44.7829 8.3525 44.7004 7.9975 44.7004 7.5875C44.7004 7.1725 44.7829 6.82 44.9479 6.53C45.1179 6.235 45.3529 6.01 45.6529 5.855C45.9579 5.7 46.3129 5.6225 46.7179 5.6225C46.9729 5.6225 47.2204 5.66 47.4604 5.735C47.7054 5.81 47.9054 5.915 48.0604 6.05L47.7304 6.83C47.6054 6.715 47.4604 6.63 47.2954 6.575C47.1354 6.515 46.9804 6.485 46.8304 6.485C46.5254 6.485 46.2879 6.58 46.1179 6.77C45.9479 6.96 45.8629 7.235 45.8629 7.595C45.8629 7.955 45.9479 8.23 46.1179 8.42C46.2879 8.61 46.5254 8.705 46.8304 8.705C46.9754 8.705 47.1279 8.6775 47.2879 8.6225C47.4529 8.5675 47.6004 8.485 47.7304 8.375L48.0604 9.1475C47.9004 9.2825 47.6979 9.39 47.4529 9.47C47.2129 9.545 46.9679 9.5825 46.7179 9.5825ZM48.7038 9.5V5.6975H49.8363V9.5H48.7038ZM48.6588 5.075V4.0175H49.8738V5.075H48.6588ZM52.2394 9.5825C51.9094 9.5825 51.6194 9.5025 51.3694 9.3425C51.1194 9.1825 50.9244 8.955 50.7844 8.66C50.6444 8.365 50.5744 8.01 50.5744 7.595C50.5744 7.185 50.6444 6.8325 50.7844 6.5375C50.9244 6.2425 51.1194 6.0175 51.3694 5.8625C51.6194 5.7025 51.9094 5.6225 52.2394 5.6225C52.5444 5.6225 52.8169 5.6975 53.0569 5.8475C53.3019 5.9925 53.4619 6.19 53.5369 6.44H53.4544L53.5444 5.6975H54.6319C54.6169 5.8625 54.6019 6.03 54.5869 6.2C54.5769 6.365 54.5719 6.5275 54.5719 6.6875V9.5H53.4469L53.4394 8.7875H53.5294C53.4494 9.0275 53.2894 9.22 53.0494 9.365C52.8094 9.51 52.5394 9.5825 52.2394 9.5825ZM52.5844 8.7275C52.8444 8.7275 53.0544 8.635 53.2144 8.45C53.3744 8.265 53.4544 7.98 53.4544 7.595C53.4544 7.21 53.3744 6.9275 53.2144 6.7475C53.0544 6.5675 52.8444 6.4775 52.5844 6.4775C52.3244 6.4775 52.1144 6.5675 51.9544 6.7475C51.7944 6.9275 51.7144 7.21 51.7144 7.595C51.7144 7.98 51.7919 8.265 51.9469 8.45C52.1069 8.635 52.3194 8.7275 52.5844 8.7275ZM14.2963 17.5V12.2125H16.7338C17.3138 12.2125 17.7613 12.335 18.0763 12.58C18.3913 12.825 18.5488 13.16 18.5488 13.585C18.5488 13.9 18.4538 14.1675 18.2638 14.3875C18.0788 14.6075 17.8238 14.755 17.4988 14.83V14.71C17.8788 14.775 18.1713 14.92 18.3763 15.145C18.5863 15.365 18.6913 15.6525 18.6913 16.0075C18.6913 16.4775 18.5238 16.845 18.1888 17.11C17.8588 17.37 17.4013 17.5 16.8163 17.5H14.2963ZM15.4138 16.63H16.6738C16.9638 16.63 17.1863 16.575 17.3413 16.465C17.4963 16.355 17.5738 16.18 17.5738 15.94C17.5738 15.695 17.4963 15.52 17.3413 15.415C17.1863 15.305 16.9638 15.25 16.6738 15.25H15.4138V16.63ZM15.4138 14.3875H16.5238C16.8288 14.3875 17.0538 14.3325 17.1988 14.2225C17.3438 14.1125 17.4163 13.9475 17.4163 13.7275C17.4163 13.5125 17.3438 13.35 17.1988 13.24C17.0538 13.13 16.8288 13.075 16.5238 13.075H15.4138V14.3875ZM20.921 17.5825C20.591 17.5825 20.301 17.5025 20.051 17.3425C19.801 17.1825 19.606 16.955 19.466 16.66C19.326 16.365 19.256 16.01 19.256 15.595C19.256 15.185 19.326 14.8325 19.466 14.5375C19.606 14.2425 19.801 14.0175 20.051 13.8625C20.301 13.7025 20.591 13.6225 20.921 13.6225C21.226 13.6225 21.4985 13.6975 21.7385 13.8475C21.9835 13.9925 22.1435 14.19 22.2185 14.44H22.136L22.226 13.6975H23.3135C23.2985 13.8625 23.2835 14.03 23.2685 14.2C23.2585 14.365 23.2535 14.5275 23.2535 14.6875V17.5H22.1285L22.121 16.7875H22.211C22.131 17.0275 21.971 17.22 21.731 17.365C21.491 17.51 21.221 17.5825 20.921 17.5825ZM21.266 16.7275C21.526 16.7275 21.736 16.635 21.896 16.45C22.056 16.265 22.136 15.98 22.136 15.595C22.136 15.21 22.056 14.9275 21.896 14.7475C21.736 14.5675 21.526 14.4775 21.266 14.4775C21.006 14.4775 20.796 14.5675 20.636 14.7475C20.476 14.9275 20.396 15.21 20.396 15.595C20.396 15.98 20.4735 16.265 20.6285 16.45C20.7885 16.635 21.001 16.7275 21.266 16.7275ZM24.1823 17.5V14.6875C24.1823 14.5275 24.1773 14.365 24.1673 14.2C24.1573 14.03 24.1423 13.8625 24.1223 13.6975H25.2098L25.2923 14.4025H25.2023C25.3273 14.1525 25.5048 13.96 25.7348 13.825C25.9648 13.69 26.2323 13.6225 26.5373 13.6225C26.9823 13.6225 27.3148 13.7525 27.5348 14.0125C27.7598 14.2675 27.8723 14.665 27.8723 15.205V17.5H26.7398V15.2575C26.7398 14.9825 26.6898 14.7875 26.5898 14.6725C26.4898 14.5575 26.3398 14.5 26.1398 14.5C25.8898 14.5 25.6898 14.58 25.5398 14.74C25.3898 14.895 25.3148 15.105 25.3148 15.37V17.5H24.1823ZM30.6119 17.5825C30.2069 17.5825 29.8519 17.5025 29.5469 17.3425C29.2419 17.1825 29.0069 16.9525 28.8419 16.6525C28.6769 16.3525 28.5944 15.9975 28.5944 15.5875C28.5944 15.1725 28.6769 14.82 28.8419 14.53C29.0119 14.235 29.2469 14.01 29.5469 13.855C29.8519 13.7 30.2069 13.6225 30.6119 13.6225C30.8669 13.6225 31.1144 13.66 31.3544 13.735C31.5994 13.81 31.7994 13.915 31.9544 14.05L31.6244 14.83C31.4994 14.715 31.3544 14.63 31.1894 14.575C31.0294 14.515 30.8744 14.485 30.7244 14.485C30.4194 14.485 30.1819 14.58 30.0119 14.77C29.8419 14.96 29.7569 15.235 29.7569 15.595C29.7569 15.955 29.8419 16.23 30.0119 16.42C30.1819 16.61 30.4194 16.705 30.7244 16.705C30.8694 16.705 31.0219 16.6775 31.1819 16.6225C31.3469 16.5675 31.4944 16.485 31.6244 16.375L31.9544 17.1475C31.7944 17.2825 31.5919 17.39 31.3469 17.47C31.1069 17.545 30.8619 17.5825 30.6119 17.5825ZM34.0753 17.5825C33.7453 17.5825 33.4553 17.5025 33.2053 17.3425C32.9553 17.1825 32.7603 16.955 32.6203 16.66C32.4803 16.365 32.4103 16.01 32.4103 15.595C32.4103 15.185 32.4803 14.8325 32.6203 14.5375C32.7603 14.2425 32.9553 14.0175 33.2053 13.8625C33.4553 13.7025 33.7453 13.6225 34.0753 13.6225C34.3803 13.6225 34.6528 13.6975 34.8928 13.8475C35.1378 13.9925 35.2978 14.19 35.3728 14.44H35.2903L35.3803 13.6975H36.4678C36.4528 13.8625 36.4378 14.03 36.4228 14.2C36.4128 14.365 36.4078 14.5275 36.4078 14.6875V17.5H35.2828L35.2753 16.7875H35.3653C35.2853 17.0275 35.1253 17.22 34.8853 17.365C34.6453 17.51 34.3753 17.5825 34.0753 17.5825ZM34.4203 16.7275C34.6803 16.7275 34.8903 16.635 35.0503 16.45C35.2103 16.265 35.2903 15.98 35.2903 15.595C35.2903 15.21 35.2103 14.9275 35.0503 14.7475C34.8903 14.5675 34.6803 14.4775 34.4203 14.4775C34.1603 14.4775 33.9503 14.5675 33.7903 14.7475C33.6303 14.9275 33.5503 15.21 33.5503 15.595C33.5503 15.98 33.6278 16.265 33.7828 16.45C33.9428 16.635 34.1553 16.7275 34.4203 16.7275ZM34.0903 13.3375L34.8628 11.8H35.9428L34.8403 13.3375H34.0903ZM37.3291 17.5V14.7025C37.3291 14.5375 37.3241 14.37 37.3141 14.2C37.3091 14.03 37.2966 13.8625 37.2766 13.6975H38.3641L38.4916 14.8075H38.3191C38.3691 14.5375 38.4491 14.315 38.5591 14.14C38.6741 13.965 38.8141 13.835 38.9791 13.75C39.1491 13.665 39.3416 13.6225 39.5566 13.6225C39.6516 13.6225 39.7266 13.6275 39.7816 13.6375C39.8366 13.6425 39.8916 13.655 39.9466 13.675L39.9391 14.6725C39.8341 14.6275 39.7441 14.6 39.6691 14.59C39.5991 14.575 39.5091 14.5675 39.3991 14.5675C39.1891 14.5675 39.0141 14.6075 38.8741 14.6875C38.7391 14.7675 38.6366 14.885 38.5666 15.04C38.5016 15.195 38.4691 15.3825 38.4691 15.6025V17.5H37.3291ZM40.4201 17.5V13.6975H41.5526V17.5H40.4201ZM40.3751 13.075V12.0175H41.5901V13.075H40.3751ZM43.9557 17.5825C43.6257 17.5825 43.3357 17.5025 43.0857 17.3425C42.8357 17.1825 42.6407 16.955 42.5007 16.66C42.3607 16.365 42.2907 16.01 42.2907 15.595C42.2907 15.185 42.3607 14.8325 42.5007 14.5375C42.6407 14.2425 42.8357 14.0175 43.0857 13.8625C43.3357 13.7025 43.6257 13.6225 43.9557 13.6225C44.2607 13.6225 44.5332 13.6975 44.7732 13.8475C45.0182 13.9925 45.1782 14.19 45.2532 14.44H45.1707L45.2607 13.6975H46.3482C46.3332 13.8625 46.3182 14.03 46.3032 14.2C46.2932 14.365 46.2882 14.5275 46.2882 14.6875V17.5H45.1632L45.1557 16.7875H45.2457C45.1657 17.0275 45.0057 17.22 44.7657 17.365C44.5257 17.51 44.2557 17.5825 43.9557 17.5825ZM44.3007 16.7275C44.5607 16.7275 44.7707 16.635 44.9307 16.45C45.0907 16.265 45.1707 15.98 45.1707 15.595C45.1707 15.21 45.0907 14.9275 44.9307 14.7475C44.7707 14.5675 44.5607 14.4775 44.3007 14.4775C44.0407 14.4775 43.8307 14.5675 43.6707 14.7475C43.5107 14.9275 43.4307 15.21 43.4307 15.595C43.4307 15.98 43.5082 16.265 43.6632 16.45C43.8232 16.635 44.0357 16.7275 44.3007 16.7275Z" fill="black"/>
                  <path d="M63.061 8.19194V5.94717C63.061 5.61798 63.4364 5.42971 63.7002 5.62662L66.8248 7.95874C67.0391 8.11871 67.0391 8.43988 66.8248 8.59985L63.7002 10.932C63.4364 11.1289 63.061 10.9406 63.061 10.6114V8.19194Z" fill="#4D4D4D"/>
                  <path d="M58.9363 7.83359C58.9363 7.61268 59.1154 7.43359 59.3363 7.43359H63.3012V9.12777H59.3363C59.1154 9.12777 58.9363 8.94868 58.9363 8.72777V7.83359Z" fill="#4D4D4D"/>
                  <path d="M62.1295 13.8081L62.1295 16.0528C62.1295 16.382 61.754 16.5703 61.4902 16.3734L58.3657 14.0413C58.1513 13.8813 58.1513 13.5601 58.3657 13.4001L61.4902 11.068C61.754 10.8711 62.1295 11.0594 62.1295 11.3886L62.1295 13.8081Z" fill="#B2B2B2"/>
                  <path d="M66.2542 14.1664C66.2542 14.3873 66.0751 14.5664 65.8542 14.5664L61.8893 14.5664L61.8893 12.8722L65.8542 12.8722C66.0751 12.8722 66.2542 13.0513 66.2542 13.2722L66.2542 14.1664Z" fill="#B2B2B2"/>
                </svg>
              </li>
              <li class="payment-flag">
                <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg" id="pix">
                  <path d="M9.19739 21.7742L4.74695 17.4453H5.43958C6.35852 17.4453 7.22327 17.097 7.87317 16.4653L11.3998 13.0347C11.6464 12.7949 12.0765 12.7941 12.3231 13.0347L15.837 16.4526C16.4869 17.0847 17.3514 17.4328 18.2706 17.4328H18.694L14.2306 21.7742C13.5358 22.4501 12.6249 22.788 11.714 22.788C10.8031 22.788 9.89221 22.4501 9.19739 21.7742ZM1.0426 13.8421C-0.347534 12.4899 -0.347534 10.2979 1.0426 8.94615L3.75037 6.31224C3.80725 6.33306 3.86731 6.34787 3.93152 6.34787H5.43958C6.07336 6.34787 6.69397 6.59786 7.14197 7.0339L10.6691 10.4646C10.9979 10.7841 11.4296 10.9443 11.8615 10.9443C12.2933 10.9443 12.7252 10.7841 13.0541 10.4643L16.5682 7.04624C17.016 6.61036 17.6366 6.36022 18.2706 6.36022H19.4967C19.5646 6.36022 19.629 6.34571 19.6884 6.32258L22.3854 8.94615C23.7755 10.2979 23.7755 12.4899 22.3854 13.8421L19.6886 16.4654C19.629 16.4422 19.5646 16.4278 19.4967 16.4278H18.2706C17.6366 16.4278 17.016 16.1778 16.5682 15.7416L13.0541 12.3241C12.4171 11.7039 11.3063 11.7042 10.6688 12.3237L7.14197 15.7543C6.69397 16.1902 6.07336 16.4403 5.43958 16.4403H3.93152C3.86731 16.4403 3.80701 16.4551 3.75037 16.4759L1.0426 13.8421ZM11.3998 9.75387L7.87317 6.32286C7.22327 5.69101 6.35852 5.34276 5.43958 5.34276H4.74719L9.19739 1.01396C10.5873 -0.337987 12.8409 -0.337987 14.2306 1.01396L18.694 5.35525H18.2706C17.3514 5.35525 16.4869 5.70336 15.837 6.33538L12.3231 9.75357C12.1959 9.87774 12.0289 9.9396 11.8617 9.93959C11.6942 9.93959 11.527 9.87753 11.3998 9.75387Z" fill="#32BCAD"></path>
                </svg>
              </li>
            </ul>

            <ul class="payment-flags-list-mobile">
              <div class="top-col">
                <li class="payment-flag">
                  <svg width="34" height="11" viewBox="0 0 34 11" fill="none" xmlns="http://www.w3.org/2000/svg" id="visa">
                    <path d="M24.3446 1.21683C23.8056 1.02137 22.9599 0.808594 21.9133 0.808594C19.2371 0.808594 17.3458 2.12392 17.3343 4.00631C17.3123 5.38985 18.675 6.16969 19.7049 6.63596C20.7631 7.11343 21.1168 7.4107 21.1116 7.83421C21.1064 8.48679 20.2659 8.77795 19.4925 8.77795C18.4176 8.77795 17.8346 8.63543 16.9355 8.26892L16.6017 8.1152L16.2207 10.2898C16.8748 10.5494 18.0471 10.7774 19.257 10.7988C22.108 10.7988 23.9668 9.49466 23.9877 7.484C24.0097 6.38144 23.2802 5.5446 21.726 4.85436C20.7882 4.40946 20.201 4.10608 20.201 3.64999C20.201 3.24684 20.7024 2.82333 21.749 2.82333C22.648 2.80704 23.2813 2.99843 23.7763 3.18881L24.0327 3.29978L24.4085 1.20564L24.3446 1.21683ZM31.3016 0.98879H29.2083C28.5542 0.98879 28.0685 1.15881 27.7797 1.79L23.7564 10.6603H26.6022L27.1758 9.20757L30.6474 9.21266C30.7343 9.55167 30.9792 10.6593 30.9792 10.6593H33.4922L31.3016 0.98879ZM13.4806 0.909381H16.1903L14.4948 10.585H11.7851L13.4806 0.90429V0.909381ZM6.59064 6.2379L6.86799 7.58479L9.52225 0.98879H12.3952L8.12081 10.6441H5.26037L2.91591 2.46803C2.86672 2.3255 2.80706 2.22878 2.65949 2.1453C1.86928 1.74215 0.980693 1.41332 0 1.18528L0.0324456 0.982681H4.40422C4.99348 1.00406 5.47283 1.18528 5.63611 1.80018L6.59063 6.24299L6.59064 6.2379ZM27.9482 7.22949L29.0335 4.52043C29.0168 4.54588 29.2565 3.96355 29.3925 3.59705L29.5778 4.42881L30.2058 7.22338H27.9482V7.22949Z" fill="#0066B2"></path>
                  </svg>
                </li>
                <li class="payment-flag">
                  <svg width="26" height="16" viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg" id="mastercard">
                    <circle cx="8" cy="8" r="8" fill="#EB001B"></circle>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4002 12.8006C13.9957 13.3389 13.525 13.8245 13 14.2454C14.3696 15.3433 16.1081 16 18 16C22.4183 16 26 12.4183 26 8C26 3.58172 22.4183 0 18 0C16.1081 0 14.3696 0.656718 13 1.75463C13.525 2.17546 13.9957 2.66111 14.4002 3.19944C15.4029 2.44629 16.6493 2 18 2C21.3137 2 24 4.68629 24 8C24 11.3137 21.3137 14 18 14C16.6493 14 15.4029 13.5537 14.4002 12.8006Z" fill="#F79E1B"></path>
                  </svg>
                </li>
                <li class="payment-flag">
                  <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg" id="dinners-club">
                    <path d="M9.34033 19.0892C4.19043 19.0892 0 15.0139 0 10.0035C0 4.99412 4.19043 0.917969 9.34033 0.917969H20.6062C25.7563 0.917969 29.9468 4.99412 29.9468 10.0035C29.9468 15.0139 25.7563 19.0892 20.6062 19.0892H9.34033ZM0.537842 10.006C0.537842 14.7268 4.48657 18.5675 9.34033 18.5675C14.1936 18.5675 18.1421 14.7268 18.1421 10.006C18.1421 5.28538 14.1936 1.44386 9.34033 1.44386C4.48657 1.44386 0.537842 5.28538 0.537842 10.006ZM11.4065 4.81625C13.5486 5.62343 15.0679 7.63995 15.0679 10.006C15.0679 12.3724 13.5466 14.3906 11.4065 15.196V4.81625ZM3.61499 10.006V10.0035C3.61499 7.63734 5.13403 5.61916 7.27515 4.81376V15.196C5.13672 14.3906 3.61499 12.3742 3.61499 10.006Z" fill="#2656A0"></path>
                  </svg>
                </li>
                <li class="payment-flag">
                  <svg width="33" height="13" viewBox="0 0 33 13" fill="none" xmlns="http://www.w3.org/2000/svg" id="elo">
                    <path d="M5.05038 3.50373C5.41434 3.38546 5.80344 3.32191 6.20859 3.32191C7.97528 3.32191 9.45029 4.5425 9.78815 6.16491L12.2925 5.668C11.7179 2.91094 9.21277 0.835938 6.20859 0.835938C5.5202 0.835938 4.85892 0.945065 4.24023 1.14613L5.05038 3.50373Z" fill="#FBC707"></path>
                    <path d="M2.09547 11.3985L3.78903 9.53605C3.03304 8.8846 2.55606 7.93383 2.55606 6.87456C2.55606 5.8153 3.03239 4.86579 3.78789 4.21513L2.09401 2.35254C0.810139 3.4588 0 5.0749 0 6.87456C0 8.67423 0.810464 10.2921 2.09547 11.3985Z" fill="#38A7E4"></path>
                    <path d="M9.78784 7.58691C9.44867 9.20852 7.9751 10.4268 6.20892 10.4268C5.80362 10.4268 5.41336 10.3632 5.04956 10.2443L4.23828 12.603C4.85712 12.8039 5.51971 12.9127 6.20892 12.9127C9.21017 12.9127 11.7148 10.8412 12.2918 8.0865L9.78784 7.58691Z" fill="#EF3120"></path>
                    <path d="M14.4829 9.61445C14.4008 9.48513 14.2894 9.27839 14.2222 9.12622C13.8256 8.23064 13.8066 7.30384 14.1415 6.4141C14.5098 5.43843 15.2132 4.6914 16.1221 4.31103C17.2648 3.83272 18.5285 3.92703 19.6237 4.55908C20.3193 4.94734 20.8125 5.54676 21.187 6.39439C21.2347 6.50288 21.2767 6.6188 21.3176 6.7172L14.4829 9.61445ZM16.7651 5.74878C15.9536 6.08798 15.5353 6.82837 15.6213 7.69651L19.0587 6.25751C18.4675 5.58192 17.6984 5.358 16.7651 5.74878ZM19.4875 8.87973C19.4867 8.88035 19.4862 8.88099 19.4855 8.88162L19.4144 8.83495C19.2093 9.15871 18.8892 9.42095 18.4854 9.59127C17.717 9.91628 17.005 9.83271 16.4937 9.39651L16.4467 9.46606C16.4467 9.46606 16.446 9.46463 16.4452 9.46463L15.5731 10.7336C15.7896 10.88 16.022 11.0039 16.2662 11.103C17.2296 11.4922 18.2151 11.4742 19.1861 11.0634C19.8884 10.7674 20.4395 10.3159 20.8161 9.74376L19.4875 8.87973Z" fill="#231F20"></path>
                    <path d="M23.7068 2.44238V9.49752L24.8344 9.94208L24.1936 11.3964L22.9489 10.8922C22.6694 10.7746 22.4792 10.5945 22.3353 10.3912C22.1976 10.184 22.0947 9.89966 22.0947 9.51677V2.44238H23.7068Z" fill="#231F20"></path>
                    <path d="M26.6283 7.69999C26.629 7.09915 26.9016 6.56043 27.3333 6.19427L26.1763 4.93945C25.3916 5.61409 24.8975 6.59985 24.8965 7.69824C24.8951 8.79695 25.3887 9.78381 26.1726 10.4602L27.3282 9.2041C26.8988 8.83637 26.6278 8.29941 26.6283 7.69999Z" fill="#231F20"></path>
                    <path d="M28.6838 9.7024C28.4561 9.70177 28.2367 9.66517 28.0321 9.59895L27.4795 11.1969C27.8572 11.3202 28.2616 11.3874 28.682 11.3881C30.5139 11.3898 32.0436 10.1255 32.3979 8.44476L30.6997 8.10742C30.5066 9.01879 29.6774 9.7032 28.6838 9.7024Z" fill="#231F20"></path>
                    <path d="M28.6887 4.01563C28.2688 4.01515 27.8644 4.08154 27.4873 4.20377L28.035 5.80315C28.2402 5.73722 28.4596 5.7008 28.6871 5.7008C29.6829 5.70175 30.5128 6.39041 30.7013 7.30397L32.3998 6.96886C32.0504 5.28588 30.5221 4.01689 28.6887 4.01563Z" fill="#231F20"></path>
                  </svg>
                </li>
                <li class="payment-flag">
                  <svg width="27" height="20" viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg" id="amex">
                    <path d="M2.48291 19.2504C1.11328 19.2504 0 18.1674 0 16.835V3.33321C0 2.00169 1.11328 0.917969 2.48291 0.917969H24.2964C25.6653 0.917969 26.7793 2.00169 26.7793 3.33321V16.835C26.7793 18.1674 25.6653 19.2504 24.2964 19.2504H2.48291ZM1.57837 3.64834V16.5199C1.57837 17.2789 2.21216 17.8951 2.99243 17.8951H23.7869C24.5662 17.8951 25.2007 17.2789 25.2007 16.5199V3.64834C25.2007 2.89032 24.5662 2.27312 23.7869 2.27312H2.99243C2.21216 2.27312 1.57837 2.89032 1.57837 3.64834ZM22.9309 12.7363L21.5684 11.0116L20.2048 12.7363H15.8418V7.43204H20.3418L21.4324 9.02349L22.7959 7.43204H24.2954L22.2515 10.0837L24.2954 12.7363H22.9309ZM16.9353 11.6753H19.5244L20.7522 10.0855L19.6614 8.62607H16.9353V9.55318H19.3887V10.6142H16.9353V11.6753ZM13.2532 12.7363V8.89133L11.7529 12.7363H10.6621L9.16187 8.75835V12.7363H6.84521L6.4375 11.543H4.11914L3.70972 12.7363H2.48218L4.52686 7.43204H6.0271L7.93604 12.471V7.43204H9.84399L11.2075 11.0116L12.571 7.43204H14.344V12.7363H13.2532ZM4.52686 10.349H5.89136L5.20898 8.49309L4.52686 10.349Z" fill="#1274B8"></path>
                  </svg>
                </li>
              </div>

              <div class="bottom-col">
                <li class="payment-flag">
                  <svg width="36" height="16" viewBox="0 0 36 16" fill="none" xmlns="http://www.w3.org/2000/svg" id="hypercard">
                    <path d="M14.7653 15.5676L0 15.5726V15.5387C0 15.52 0.0235443 15.3989 0.0523376 15.2695C0.0812378 15.1402 0.125923 14.9343 0.151886 14.8122C0.177734 14.69 0.222046 14.4826 0.250183 14.3509C0.31955 14.0293 0.388107 13.7077 0.455803 13.3858C0.482399 13.2589 0.526772 13.0513 0.554543 12.9246C0.589859 12.7623 0.624809 12.6 0.659492 12.4376C0.689514 12.2966 0.735107 12.0814 0.760849 11.9592C0.786537 11.837 0.827591 11.6488 0.851776 11.5407C0.876022 11.4327 0.906944 11.2866 0.920441 11.2162C0.934029 11.1456 0.977859 10.9381 1.0179 10.7549C1.05161 10.6014 1.08437 10.4476 1.11609 10.2937C1.13007 10.2232 1.17442 10.0156 1.21473 9.83238C1.25497 9.64926 1.29918 9.44161 1.31293 9.37117C1.32668 9.30075 1.37121 9.09304 1.41177 8.90996C1.45234 8.72666 1.49617 8.52288 1.50907 8.45723C1.52208 8.39144 1.55751 8.22231 1.58795 8.0814C1.61824 7.94041 1.67583 7.67515 1.7157 7.49197C1.75568 7.30873 1.82386 6.98972 1.86726 6.78297C1.91082 6.57625 1.96284 6.33028 1.98285 6.23632C2.04182 5.96001 2.10123 5.6839 2.16122 5.40781C2.19077 5.27157 2.23888 5.04861 2.26815 4.91229C2.29736 4.77609 2.34244 4.56459 2.36829 4.44253C2.39403 4.32035 2.43813 4.11665 2.46611 3.98984C2.49415 3.86293 2.54243 3.63998 2.5733 3.49433C2.60424 3.34873 2.65604 3.12579 2.68842 2.99891C2.72074 2.87206 2.76646 2.71834 2.79011 2.65726C2.81365 2.59616 2.87878 2.46378 2.93476 2.36306L3.03649 2.17992L3.12902 2.06405C3.1798 2.00037 3.27064 1.8998 3.33078 1.84046C3.39094 1.78112 3.49236 1.69189 3.5563 1.64213C3.6201 1.59232 3.71262 1.52511 3.76176 1.49284C3.81088 1.46052 3.90738 1.40392 3.97625 1.36701C4.04502 1.3302 4.14162 1.28201 4.19075 1.25988C4.23988 1.23775 4.34038 1.19726 4.41407 1.16998C4.48771 1.14286 4.62857 1.09722 4.72678 1.06864C4.82503 1.04011 5.00962 0.997054 5.13688 0.973114C5.26403 0.94901 5.46505 0.916891 5.58362 0.901693L5.79908 0.873997L20.5735 0.868684L35.3479 0.863281V0.897211C35.3479 0.915852 35.3243 1.03694 35.2953 1.16634C35.2588 1.33001 35.223 1.49388 35.1878 1.6578C35.1575 1.79877 35.1135 2.00256 35.0898 2.11053C35.0563 2.26425 35.0231 2.41797 34.9902 2.5718C34.959 2.71751 34.9112 2.94051 34.8839 3.06722C34.8565 3.19413 34.8121 3.40172 34.7853 3.52859C34.7586 3.65539 34.714 3.86293 34.6863 3.98981C34.654 4.1378 34.6222 4.28584 34.5908 4.43399C34.566 4.55143 34.521 4.76278 34.491 4.90375C34.461 5.04466 34.4127 5.26762 34.3837 5.39921C34.3547 5.5307 34.3107 5.73444 34.2857 5.85189C34.2607 5.96927 34.2157 6.18073 34.1858 6.32164C34.1558 6.4626 34.1076 6.68552 34.0787 6.81711C34.0497 6.9487 34.0067 7.14855 33.9828 7.26131C33.9167 7.57458 33.8501 7.8878 33.7832 8.20091C33.7589 8.31362 33.7158 8.51362 33.6873 8.645C33.6508 8.81303 33.6145 8.98097 33.5787 9.14912C33.5474 9.29481 33.5029 9.50214 33.4796 9.61032C33.4561 9.71833 33.4125 9.92207 33.3825 10.0629C33.3472 10.2282 33.3118 10.3934 33.2761 10.5585C33.2478 10.69 33.2033 10.8976 33.1771 11.0198C33.1512 11.1419 33.1058 11.3533 33.0767 11.4895C33.0474 11.6257 32.9996 11.8486 32.9703 11.9849C32.9412 12.1212 32.8976 12.3249 32.8732 12.4377C32.8402 12.5914 32.8074 12.7451 32.7747 12.8988C32.7396 13.0636 32.7034 13.2281 32.6664 13.3925L32.6126 13.6297L32.5486 13.7938C32.5134 13.8842 32.4603 14.0042 32.4308 14.0605C32.4012 14.1169 32.3411 14.2164 32.2971 14.2816C32.2531 14.3468 32.1919 14.4302 32.1609 14.4671C32.13 14.5041 32.0369 14.5994 31.9539 14.6789L31.8034 14.8235L31.6583 14.922C31.5785 14.9762 31.4925 15.0314 31.4673 15.0445C31.442 15.0577 31.3459 15.1046 31.2537 15.1488C31.1615 15.1929 31.0313 15.2491 30.9644 15.2735C30.8974 15.2982 30.7647 15.3399 30.6695 15.3663C30.5742 15.3929 30.4722 15.4189 30.4427 15.4243C30.4132 15.4298 30.311 15.4499 30.2153 15.4693C30.1197 15.4886 29.9267 15.5176 29.7864 15.5335L29.5313 15.5625L14.7653 15.5676ZM9.51198 11.9165H9.89623L9.90705 11.8894C9.91307 11.8745 9.91796 11.8396 9.91796 11.8119C9.91796 11.7839 9.93064 11.6827 9.94611 11.5868C9.96152 11.4909 9.99787 11.2702 10.0268 11.0964C10.0558 10.9225 10.099 10.6613 10.123 10.5156C10.1458 10.3777 10.1676 10.2396 10.1882 10.1013C10.2 10.0191 10.2143 9.9518 10.2202 9.9518C10.2259 9.9518 10.2508 9.98813 10.2754 10.0326L10.32 10.1133L10.4191 10.2087L10.5183 10.3041L10.6401 10.3508L10.7621 10.3975L10.9073 10.4155L11.0528 10.4335L11.2372 10.4227L11.4216 10.4119L11.6214 10.3625L11.8211 10.313L11.9283 10.2663C11.9874 10.2406 12.0919 10.1845 12.1606 10.1416L12.2858 10.0638L12.4024 9.95222C12.4666 9.89111 12.5571 9.79272 12.6035 9.73396C12.6499 9.67508 12.6879 9.62264 12.6879 9.6174C12.6879 9.61214 12.7108 9.57576 12.7386 9.53644C12.7665 9.4972 12.8235 9.38809 12.8653 9.29419C12.9072 9.20018 12.9725 9.03109 13.0107 8.91834L13.08 8.71335L13.1157 8.53579C13.1355 8.43807 13.1608 8.27671 13.1721 8.17697L13.1925 7.99582L13.1807 7.84208L13.1688 7.68836L13.1316 7.53454L13.0943 7.38081L13.0339 7.26573L12.9736 7.15052L12.857 7.03241L12.7404 6.91419L12.6025 6.84605L12.4645 6.7778L12.3126 6.74303L12.1606 6.70831L12.0087 6.69769L11.8569 6.68702L11.6877 6.7056L11.5184 6.72409L11.3803 6.75781L11.2423 6.79144L11.1223 6.84464C11.0563 6.87374 10.9602 6.92335 10.9089 6.9548C10.8576 6.98619 10.8045 7.02232 10.7911 7.03511C10.7778 7.04781 10.7457 7.0715 10.7199 7.08758L10.6729 7.11695L10.7057 6.96682C10.7238 6.88431 10.7388 6.80727 10.7392 6.79544L10.74 6.77409H10.0847L10.0273 7.12007C9.99567 7.31043 9.94579 7.6044 9.9164 7.77357C9.85161 8.14667 9.78605 8.51964 9.71973 8.89251C9.69057 9.0569 9.64225 9.31838 9.61238 9.47335C9.58257 9.62842 9.5389 9.85518 9.51529 9.97746C9.49175 10.0996 9.44727 10.3301 9.41672 10.4899C9.3806 10.6778 9.34409 10.8658 9.30722 11.0536C9.27239 11.2304 9.2368 11.4068 9.20035 11.5832C9.17113 11.7241 9.14293 11.8568 9.13747 11.878L9.12767 11.9164L9.51198 11.9165ZM11.1661 9.94129L11.017 9.94989L10.9195 9.93338L10.8219 9.91702L10.7229 9.87377L10.6237 9.83047L10.5546 9.76733L10.4854 9.70423L10.4455 9.61881C10.4235 9.57179 10.3952 9.49194 10.3828 9.44135L10.36 9.34937L10.3692 9.20215L10.3784 9.05499L10.4243 8.82427C10.4591 8.64803 10.4927 8.4715 10.5254 8.29475C10.5556 8.13032 10.6015 7.88929 10.6272 7.75932L10.6739 7.52287L10.7764 7.44136C10.8328 7.39659 10.922 7.33647 10.9748 7.30795L11.0707 7.25593L11.1957 7.21893L11.3209 7.18187L11.4817 7.17286L11.6426 7.16379L11.7735 7.19055L11.9044 7.21721L11.997 7.25792L12.0894 7.29863L12.1668 7.37311L12.2444 7.4476L12.2861 7.52648C12.3092 7.56983 12.3414 7.6548 12.3579 7.71512L12.3878 7.82491L12.3787 8.14958L12.3695 8.47415L12.3236 8.66602C12.2984 8.77155 12.2504 8.93301 12.2169 9.0248L12.156 9.19173L12.0814 9.32676C12.0403 9.40105 11.9772 9.50152 11.9408 9.54995C11.9046 9.59839 11.8467 9.66117 11.8123 9.68933C11.7707 9.72323 11.728 9.75597 11.6843 9.78747L11.6188 9.83416L11.4672 9.88339L11.3155 9.93271L11.1661 9.94129ZM14.877 10.4108L15.0736 10.4131L15.2702 10.3959C15.3783 10.3865 15.5552 10.3668 15.6633 10.3523C15.7715 10.3378 15.9582 10.3051 16.0784 10.2799L16.2968 10.2339L16.3077 10.1569C16.3137 10.1146 16.3382 9.98861 16.3622 9.87673L16.4059 9.67367L16.3961 9.66445L16.3866 9.6553L16.3198 9.68605C16.283 9.70303 16.1686 9.74353 16.0655 9.77601L15.8781 9.83504L15.6812 9.87153L15.4846 9.90797L15.1718 9.90859L14.8591 9.90907L14.7518 9.87631C14.6928 9.85841 14.6061 9.82552 14.5591 9.80324L14.4736 9.76283L14.403 9.70183L14.3324 9.64083L14.2773 9.54879L14.2223 9.45665L14.1877 9.34134L14.1531 9.22584L14.1529 9.0122L14.1526 8.79856L14.1832 8.60803L14.214 8.41751L14.4828 8.40554L14.7517 8.39351L15.7458 8.39966L16.7398 8.40574L16.7698 8.28399C16.7864 8.21704 16.8116 8.07867 16.8259 7.97649L16.852 7.79071L16.8526 7.63448L16.8532 7.47821L16.8249 7.36145L16.7965 7.24484L16.7497 7.16759C16.7241 7.12511 16.6786 7.06353 16.6489 7.0307C16.6193 6.99794 16.5663 6.95173 16.5311 6.92804C16.496 6.90435 16.4272 6.86453 16.378 6.83953L16.2885 6.7941L16.1325 6.75818L15.9764 6.72231L15.7841 6.70472L15.5916 6.68707L15.4129 6.69816L15.2343 6.70935L15.0198 6.7487L14.8054 6.78812L14.6713 6.83928C14.5976 6.86739 14.485 6.91878 14.421 6.95345C14.3573 6.98806 14.2687 7.04443 14.2246 7.07869C14.1803 7.11294 14.1037 7.17957 14.0543 7.22674C14.005 7.27389 13.9318 7.35848 13.8921 7.41492C13.8522 7.47134 13.7911 7.57118 13.7562 7.63702C13.7213 7.70283 13.676 7.79503 13.6553 7.84204C13.6346 7.88898 13.5971 7.98509 13.5719 8.05557C13.5466 8.12606 13.507 8.26062 13.4838 8.35457C13.4565 8.46847 13.4329 8.58305 13.4131 8.69824L13.3847 8.87124L13.385 9.12541L13.3852 9.37956L13.4124 9.49064C13.4272 9.5517 13.4559 9.64399 13.4758 9.69568C13.4957 9.74727 13.5328 9.82426 13.5579 9.86644C13.5831 9.9087 13.6368 9.9769 13.6774 10.0178C13.7179 10.0587 13.7912 10.1208 13.8404 10.1558C13.8896 10.1906 13.977 10.2398 14.0347 10.2651L14.1398 10.3107L14.2863 10.3446C14.3669 10.3631 14.4885 10.3853 14.5566 10.3937C14.6247 10.402 14.7688 10.4098 14.877 10.4108ZM15.2135 8.00429C14.7188 8.00429 14.314 8.00097 14.314 7.99674C14.314 7.99252 14.3352 7.93302 14.361 7.86436C14.3867 7.79565 14.432 7.69347 14.4616 7.63724L14.5154 7.53491L14.6336 7.42257L14.7518 7.31008L14.8681 7.25703C14.9319 7.22776 15.0164 7.19597 15.0556 7.18634C15.095 7.17666 15.2076 7.16385 15.3058 7.15791L15.4847 7.14687L15.6219 7.16373L15.759 7.18061L15.8587 7.22433L15.9585 7.26795L16.0132 7.32434C16.0432 7.35536 16.079 7.40101 16.0928 7.42579L16.1178 7.47088L16.1343 7.57097L16.1509 7.67108L16.1319 7.83766L16.113 8.00423L15.2135 8.00429ZM20.5598 10.4109L20.7565 10.4131L20.9798 10.3878C21.1026 10.3739 21.266 10.3509 21.3431 10.3366C21.4361 10.3186 21.5286 10.2977 21.62 10.2737C21.6954 10.2533 21.7636 10.2314 21.7715 10.2248C21.7795 10.2182 21.8008 10.1407 21.8189 10.0525C21.8369 9.9643 21.8598 9.84592 21.8694 9.78955C21.8791 9.73316 21.8842 9.68414 21.8805 9.68034C21.877 9.67668 21.8638 9.68143 21.8513 9.69095C21.8388 9.70048 21.7511 9.73571 21.6565 9.76929L21.4843 9.83041L21.2393 9.8757L20.9943 9.92115L20.7859 9.91443L20.5775 9.90757L20.4592 9.8683L20.3408 9.82901L20.2494 9.75263L20.1579 9.67612L20.0973 9.5705L20.0367 9.46498L20.0077 9.32365L19.9789 9.18242L19.9791 8.99908L19.9792 8.81579L20.0143 8.59362L20.0494 8.37155L20.0865 8.25186C20.107 8.18612 20.13 8.10935 20.138 8.08112C20.1458 8.05292 20.1785 7.97219 20.2107 7.90175C20.243 7.83131 20.3005 7.72241 20.3385 7.65969L20.4076 7.54579L20.4926 7.46162L20.5777 7.37743L20.6676 7.32418L20.7575 7.27088L20.8731 7.23683C20.9367 7.21814 21.049 7.19383 21.1227 7.18291L21.2568 7.16287L21.4532 7.17234L21.6499 7.18181L21.8822 7.22626L22.1145 7.27067L22.209 7.3043C22.261 7.32289 22.3058 7.33802 22.3086 7.33802C22.3113 7.33802 22.3238 7.27457 22.3363 7.19701C22.3487 7.11955 22.3709 6.99202 22.3855 6.91373C22.4001 6.83527 22.4087 6.76776 22.4043 6.76369C22.3999 6.75953 22.3302 6.74901 22.2492 6.74016C22.1681 6.73138 21.948 6.7157 21.7597 6.70529L21.4177 6.68654L21.1764 6.70425L20.9351 6.72195L20.7564 6.75777L20.5777 6.79369L20.4626 6.83772C20.3992 6.86193 20.3065 6.90566 20.2566 6.93475C20.2087 6.96265 20.1615 6.9917 20.1151 7.02194C20.0872 7.04073 20.003 7.11409 19.9276 7.18493L19.7908 7.31373L19.7143 7.42074C19.6724 7.47962 19.5996 7.60222 19.5528 7.69341L19.4677 7.85916L19.4024 8.03849C19.3664 8.13713 19.3163 8.29855 19.291 8.39721L19.245 8.57664L19.2282 8.73895L19.2115 8.90127L19.2116 9.1148L19.2119 9.32838L19.2288 9.45254L19.2456 9.57684L19.2991 9.70469L19.3526 9.83244L19.4145 9.92474L19.4762 10.0172L19.5745 10.1096L19.6729 10.202L19.7769 10.2547L19.8809 10.3072L20.0176 10.3435C20.0925 10.3634 20.2012 10.3863 20.2587 10.3944C20.3162 10.4024 20.4516 10.4099 20.5598 10.4109ZM23.4994 10.4047L23.7406 10.3981L23.8925 10.3609L24.0444 10.3236L24.1428 10.2793C24.1968 10.2548 24.2852 10.2067 24.3394 10.1721C24.3935 10.1376 24.4771 10.0719 24.5253 10.0264C24.5734 9.98059 24.645 9.90266 24.6842 9.8531C24.7233 9.80354 24.7577 9.76525 24.7606 9.76789C24.7636 9.7707 24.7546 9.84972 24.7406 9.94347C24.7267 10.0373 24.7152 10.1621 24.715 10.2208L24.7146 10.3276H25.3706L25.3807 10.0841L25.3907 9.84068L25.4375 9.52463C25.4632 9.35076 25.5048 9.09325 25.5299 8.95234C25.555 8.81135 25.5984 8.57311 25.6268 8.42272C25.6549 8.27243 25.6996 8.03792 25.726 7.90169L25.774 7.65402L25.7756 7.44001L25.7772 7.22605L25.7267 7.12721L25.676 7.0283L25.6074 6.96537L25.5388 6.90232L25.4262 6.84782L25.3135 6.79312L25.1456 6.7574L24.9776 6.72163L24.7464 6.70493L24.5152 6.68811L24.2175 6.70576C24.0536 6.71544 23.8231 6.73455 23.7052 6.74824L23.4907 6.77307L23.3446 6.77365L23.1985 6.77421L23.1773 6.87254C23.1656 6.92648 23.133 7.05485 23.105 7.15777C23.0769 7.26067 23.0567 7.34724 23.0599 7.35021C23.0629 7.35339 23.1412 7.33627 23.2335 7.31257C23.3259 7.28879 23.5222 7.24974 23.6696 7.2257L23.9375 7.18202L24.1788 7.17259L24.4201 7.16298L24.5755 7.18899L24.7308 7.21512L24.8345 7.26401L24.9383 7.313L24.9963 7.3957L25.0544 7.47848L25.0536 7.60892L25.0527 7.73943L25.022 7.88259L24.9912 8.02574L24.3482 8.02798L23.7051 8.03016L23.4947 8.08539C23.3789 8.11574 23.2508 8.15598 23.2099 8.17487C23.169 8.19377 23.128 8.20929 23.1189 8.20929C23.1099 8.20929 23.041 8.24567 22.966 8.29044L22.8295 8.37149L22.7221 8.47411C22.6629 8.53042 22.5874 8.61502 22.5542 8.66207C22.5211 8.70903 22.4671 8.80703 22.4344 8.88013L22.3751 9.01272L22.3476 9.16197L22.3202 9.31105V9.62422L22.3463 9.75456L22.3724 9.88476L22.4208 9.96988C22.4474 10.0166 22.4963 10.0851 22.5293 10.1221L22.5896 10.1891L22.6963 10.2512L22.8032 10.3134L22.9256 10.3464C22.9929 10.3645 23.0953 10.3866 23.1532 10.3954L23.2585 10.4112L23.4994 10.4047ZM23.7228 9.92688L23.5798 9.93415L23.4851 9.9111C23.433 9.89838 23.3541 9.87018 23.3096 9.84826L23.2286 9.80854L23.1844 9.75832C23.1601 9.73062 23.1231 9.67648 23.1019 9.63786L23.0636 9.56752L23.0562 9.40319L23.0485 9.239L23.0789 9.13943C23.0955 9.08461 23.1345 8.9895 23.1658 8.92812L23.2223 8.81641L23.3307 8.71365L23.4389 8.61075L23.554 8.55776L23.669 8.50486L23.812 8.47233L23.9549 8.43985H24.8485L24.8767 8.45104L24.9049 8.46217L24.8811 8.59627C24.8681 8.66998 24.8369 8.8034 24.8118 8.89257C24.7867 8.9819 24.7425 9.11302 24.7135 9.18429C24.6845 9.2553 24.6608 9.31819 24.6608 9.32396C24.6608 9.32973 24.6314 9.38153 24.5954 9.43906L24.5302 9.54389L24.4231 9.64541C24.3642 9.70106 24.3095 9.74675 24.3015 9.74675C24.2935 9.74675 24.2575 9.76604 24.2213 9.7895L24.1554 9.83219L24.0105 9.87602L23.8655 9.91984L23.7228 9.92688ZM29.5396 10.4108L29.7093 10.4128L29.8702 10.3878C29.9587 10.3742 30.0712 10.3521 30.1204 10.3387C30.1695 10.3254 30.2581 10.291 30.317 10.2621L30.4242 10.2096L30.5165 10.132L30.6088 10.0543L30.7059 9.93041C30.7593 9.86238 30.8077 9.79513 30.8134 9.78101L30.8237 9.75539L30.8146 9.84083C30.8083 9.89798 30.8001 9.95498 30.79 10.0117C30.7813 10.0587 30.7689 10.149 30.7625 10.2123L30.7506 10.3277H31.4518V10.097L31.5051 9.66138C31.5345 9.42171 31.578 9.10277 31.6016 8.95244C31.6253 8.80209 31.662 8.58689 31.6832 8.47415C31.704 8.3614 31.7413 8.15764 31.7658 8.02141C31.7903 7.88524 31.8345 7.64689 31.864 7.49185C31.8936 7.33678 31.941 7.09081 31.9692 6.94511C31.9975 6.79952 32.0414 6.57271 32.0669 6.44121C32.0923 6.30967 32.1379 6.07894 32.1681 5.92867C32.1998 5.77183 32.2325 5.61524 32.2663 5.45881C32.2901 5.35078 32.3096 5.25662 32.3096 5.24959V5.23674H31.5445L31.5333 5.34351C31.5271 5.40233 31.4979 5.59629 31.4682 5.7749C31.4332 5.98572 31.3975 6.19639 31.361 6.407C31.34 6.52846 31.319 6.64995 31.2984 6.77151L31.2887 6.82845L31.2586 6.81622C31.2419 6.8094 31.152 6.78551 31.0587 6.76311L30.8889 6.72235L30.6567 6.70508L30.4242 6.6878L30.2275 6.70529L30.031 6.72283L29.8523 6.76604L29.6736 6.8092L29.5038 6.88836L29.334 6.96755L29.2089 7.05604L29.0839 7.14453L28.9758 7.25531C28.9164 7.31627 28.8306 7.41694 28.785 7.47925L28.7024 7.59227L28.6052 7.7855C28.5518 7.8918 28.4868 8.03266 28.4608 8.09835C28.4348 8.1642 28.3888 8.30991 28.3587 8.42235L28.3041 8.62676L28.2771 8.89236L28.2501 9.15764L28.2704 9.37122L28.2907 9.58481L28.3146 9.66165C28.3277 9.70401 28.3555 9.77939 28.3762 9.82905L28.4138 9.91964L28.4827 10.0086L28.5515 10.0977L28.6301 10.1592L28.7086 10.2207L28.8158 10.2716C28.8749 10.2995 28.9737 10.3358 29.0357 10.3519C29.0976 10.3681 29.198 10.3877 29.2591 10.3953C29.32 10.4025 29.4462 10.4097 29.5396 10.4108ZM29.8443 9.92614L29.7093 9.93285L29.6184 9.91735C29.5683 9.9087 29.4882 9.88553 29.4402 9.86592L29.3532 9.8303L29.2799 9.77289L29.2068 9.71547L29.1523 9.61579L29.098 9.51615L29.0729 9.40512L29.0482 9.29408L29.0503 9.07195L29.0524 8.8499L29.0812 8.65331L29.11 8.45698L29.1547 8.32033C29.1795 8.24515 29.1997 8.17419 29.1998 8.1627C29.2 8.15114 29.2243 8.08977 29.2538 8.02605C29.2885 7.95245 29.3251 7.87966 29.3638 7.80778C29.3945 7.7514 29.4521 7.66354 29.4916 7.61253C29.5313 7.56152 29.6017 7.48462 29.6484 7.44162C29.6949 7.39877 29.769 7.34246 29.8131 7.31659L29.893 7.26957L30.0335 7.22309L30.174 7.17645L30.4689 7.17633H30.7639L30.9336 7.22138C31.0269 7.24621 31.1262 7.27484 31.1539 7.28525L31.2045 7.30404L31.1946 7.35089C31.1892 7.37664 31.1678 7.49002 31.1473 7.60274C31.1269 7.71554 31.0863 7.93084 31.0574 8.08112C31.0284 8.23142 30.9841 8.45827 30.9586 8.58508C30.9333 8.712 30.8966 8.87342 30.877 8.94385C30.8569 9.01626 30.8364 9.0885 30.8157 9.16081C30.8014 9.2096 30.7677 9.29419 30.7408 9.34869C30.7137 9.40313 30.6663 9.48237 30.6356 9.52468C30.6047 9.56696 30.5527 9.62561 30.5197 9.65482C30.4869 9.68419 30.4158 9.73625 30.3617 9.77055L30.2634 9.83306L30.1213 9.87612L29.9793 9.91922L29.8443 9.92614ZM3.54346 10.3277H3.97758L4.00878 10.1441C4.02586 10.043 4.05936 9.84893 4.08311 9.71277L4.18137 9.149C4.21167 8.97512 4.25716 8.71757 4.28237 8.57664C4.30753 8.43573 4.34764 8.2171 4.3713 8.09085C4.39511 7.96447 4.41904 7.85692 4.42455 7.85161L4.43462 7.84204H6.76961L6.78261 7.85443L6.79561 7.86681L6.77535 7.96541C6.76426 8.0197 6.7313 8.1871 6.70224 8.33738C6.67307 8.48773 6.62415 8.74146 6.59333 8.90121C6.56099 9.06931 6.52814 9.23734 6.49469 9.40518C6.47115 9.52265 6.4234 9.76851 6.38868 9.9518C6.35399 10.1351 6.32564 10.2946 6.32575 10.3064L6.32596 10.3277H7.1979L7.21717 10.2209C7.22783 10.1622 7.24491 10.0565 7.25518 9.98604C7.26534 9.91557 7.29012 9.76565 7.31008 9.65294C7.33004 9.54015 7.36986 9.31715 7.39865 9.15743C7.42739 8.99768 7.47565 8.72479 7.50573 8.55099C7.53582 8.37713 7.58043 8.12345 7.60501 7.98727C7.63599 7.81615 7.66832 7.64538 7.70188 7.47474C7.73067 7.32897 7.77868 7.08311 7.80858 6.92799C7.8385 6.77303 7.88318 6.5385 7.90792 6.40696C7.9328 6.27547 7.97803 6.03715 8.00852 5.8774C8.03897 5.71764 8.07756 5.53122 8.09404 5.46308L8.12418 5.33913H7.24132L7.22933 5.42039C7.22274 5.46491 7.20145 5.59006 7.18196 5.69796C7.16243 5.80613 7.12705 5.99822 7.10324 6.12507C7.07943 6.25199 7.03597 6.49404 7.00653 6.66328C6.97774 6.82898 6.95002 6.99478 6.92336 7.16078L6.89356 7.35073L6.24558 7.36329L5.59754 7.37581L5.05483 7.36354C4.75631 7.35673 4.51041 7.34981 4.50837 7.3483C4.50628 7.34657 4.51645 7.2802 4.53084 7.20066C4.5499 7.09816 4.57012 6.99587 4.59163 6.89384C4.61904 6.76292 4.64563 6.63199 4.6715 6.50082C4.69649 6.37401 4.72474 6.21644 4.73442 6.15065C4.74395 6.08488 4.76412 5.97537 4.77906 5.90711C4.79404 5.83903 4.8225 5.69557 4.8423 5.58838C4.86205 5.4811 4.88315 5.38114 4.88915 5.36622L4.89995 5.33909H4.0242L3.99627 5.48864C3.9808 5.57089 3.9602 5.68813 3.95051 5.74913C3.94082 5.81024 3.90817 6.00625 3.87799 6.18478C3.84791 6.36334 3.80328 6.62857 3.77904 6.77415L3.68099 7.36354C3.64648 7.56875 3.61015 7.77384 3.57192 7.97853C3.54014 8.14661 3.50776 8.3146 3.47469 8.48252C3.45141 8.59988 3.40714 8.82292 3.37626 8.97794C3.34383 9.14042 3.31045 9.30272 3.27604 9.46487C3.25179 9.57752 3.22503 9.70824 3.21664 9.75524C3.20807 9.80225 3.1804 9.9377 3.15509 10.0564C3.12977 10.1749 3.10906 10.2845 3.10906 10.2999V10.3276L3.54346 10.3277ZM8.35018 10.3277H8.73455L8.7454 10.3006C8.75139 10.2857 8.75628 10.2467 8.75628 10.2141C8.75628 10.1813 8.78046 10.0109 8.80996 9.8353C8.87737 9.43541 8.94648 9.03583 9.01732 8.63641C9.04761 8.46816 9.07961 8.30017 9.1131 8.13241C9.14159 7.9915 9.18531 7.77238 9.21025 7.64553C9.23508 7.51867 9.28415 7.27738 9.31916 7.10923C9.35411 6.9411 9.38712 6.7968 9.39248 6.78858L9.40221 6.77359L9.01346 6.77812L8.62477 6.78275L8.59235 7.00498C8.57457 7.12709 8.53562 7.36927 8.50586 7.54301C8.47611 7.71689 8.4311 7.98218 8.40574 8.13241C8.37517 8.31215 8.34253 8.49149 8.30779 8.67055C8.27921 8.81621 8.23543 9.03911 8.21045 9.16602C8.18552 9.29298 8.14072 9.51582 8.11097 9.66143C8.08115 9.80715 8.04122 9.99928 8.02217 10.0885C8.00307 10.1779 7.98258 10.2682 7.97663 10.2892L7.96581 10.3277H8.35018ZM17.3405 10.3277H17.722L17.7334 10.1734C17.7398 10.0885 17.7613 9.9175 17.7814 9.7932C17.8015 9.66904 17.8427 9.42135 17.8729 9.24289C17.9111 9.02225 17.9525 8.80205 17.9975 8.58249C18.0359 8.39783 18.0792 8.21422 18.0939 8.17462C18.1085 8.1349 18.1205 8.09195 18.1205 8.0791C18.1205 8.06618 18.1492 7.99601 18.1843 7.92319C18.2193 7.85035 18.2847 7.73881 18.3295 7.67524L18.4109 7.55978L18.5199 7.46326L18.6289 7.36677L18.7634 7.30539L18.8979 7.24401L19.1034 7.24505L19.309 7.24615L19.41 7.27493C19.4655 7.29087 19.5158 7.30387 19.5217 7.30387C19.5274 7.30387 19.5323 7.28566 19.5323 7.26349C19.5323 7.24136 19.5524 7.12881 19.577 7.01341C19.6016 6.89812 19.6216 6.79888 19.6216 6.793C19.6216 6.78702 19.5633 6.76514 19.492 6.74442C19.4208 6.72376 19.3223 6.70211 19.2732 6.69628L19.1837 6.68571L19.0677 6.70535C19.0038 6.71612 18.9088 6.73996 18.8567 6.75838C18.8044 6.77665 18.7181 6.81831 18.6649 6.85072C18.6118 6.88336 18.5291 6.94672 18.4812 6.99153C18.4333 7.03648 18.3527 7.12709 18.3021 7.19284C18.2627 7.24395 18.2235 7.29519 18.1846 7.34656L18.159 7.38071L18.1745 7.31242C18.183 7.27472 18.2068 7.15171 18.2273 7.03907C18.2478 6.92632 18.269 6.82054 18.2742 6.80413L18.2838 6.77421H17.6023V6.81539C17.6023 6.83808 17.5821 6.97446 17.5576 7.11855C17.533 7.2628 17.4925 7.50366 17.4675 7.65406C17.4425 7.80435 17.3982 8.06581 17.3691 8.2349C17.338 8.41449 17.3051 8.59387 17.2706 8.77294C17.2033 9.11491 17.1345 9.45659 17.0642 9.79798C17.0341 9.9437 16.9981 10.1157 16.9843 10.1803C16.9702 10.2447 16.9589 10.3042 16.9589 10.3126V10.3276L17.3405 10.3277ZM26.3977 10.3277H26.7878V10.0994L26.8328 9.81631C26.8576 9.66076 26.8984 9.41408 26.9235 9.26852C26.9486 9.12286 26.9799 8.93837 26.993 8.85842C27.0062 8.77857 27.041 8.6057 27.0705 8.47411C27.1 8.34255 27.1367 8.20028 27.1523 8.15801C27.1677 8.1158 27.1806 8.07139 27.1807 8.05948C27.1809 8.04754 27.2141 7.97078 27.2545 7.88894L27.3282 7.74L27.4254 7.61663L27.5225 7.49326L27.6287 7.41684C27.6873 7.37473 27.7812 7.31903 27.8377 7.2929L27.9404 7.24536L28.1638 7.24683L28.3871 7.24833L28.4751 7.27536L28.5631 7.30237L28.5778 7.29351L28.5926 7.28477L28.5935 7.23027C28.5938 7.20024 28.6129 7.08873 28.6359 6.98232L28.6776 6.78889L28.6308 6.77135C28.5856 6.7553 28.5402 6.74054 28.4943 6.7269L28.4051 6.69993L28.2442 6.7004L28.0834 6.70076L27.9523 6.74491L27.8212 6.78894L27.7229 6.84574L27.6243 6.90252L27.4964 7.03064L27.3684 7.15875L27.2996 7.25817C27.2619 7.31278 27.2286 7.35505 27.2257 7.35204C27.2227 7.34911 27.2434 7.23521 27.2714 7.09899C27.2994 6.96271 27.3227 6.83392 27.3231 6.81279L27.3239 6.77438H26.6627V6.78526C26.6627 6.79122 26.6462 6.90086 26.626 7.02876C26.6059 7.15667 26.5654 7.40352 26.5362 7.57739C26.501 7.7853 26.4654 7.9931 26.4294 8.20091C26.3979 8.3806 26.3651 8.55993 26.3307 8.73912C26.3058 8.86591 26.2618 9.08883 26.2327 9.23453C26.2037 9.38018 26.1559 9.61469 26.1267 9.7556L26.0404 10.1699L26.0075 10.3278L26.3977 10.3277ZM9.10636 6.15891L9.21474 6.15927L9.30101 6.13122L9.38729 6.10311L9.46364 6.02904L9.53997 5.95511L9.5801 5.85641L9.62035 5.75777L9.62174 5.61259L9.62323 5.46746L9.5875 5.41066L9.55179 5.35392L9.4896 5.31721L9.42727 5.28031H9.1586L9.06714 5.31947L8.97574 5.35861L8.92264 5.413L8.86956 5.46746L8.82781 5.56141L8.78612 5.65532L8.77826 5.80171L8.77044 5.94804L8.80919 6.02081L8.84798 6.09347L8.92296 6.12601L8.99778 6.15844L9.10636 6.15891Z" fill="#B3131B"></path>
                  </svg>
                </li>
                <li class="payment-flag">
                  <svg width="37" height="24" viewBox="0 0 37 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="boleto-bancario">
                    <path d="M33.7772 24H2.51088C1.12428 23.9981 0.000946045 22.9047 0 21.556L1.52588e-05 2.44235C0.00190735 1.09423 1.12495 0.00184044 2.51088 0L33.7772 2.96845e-05C35.1632 0.00184044 36.2862 1.09426 36.2881 2.44235L36.2881 21.556C36.2871 22.9047 35.1639 23.9982 33.7772 24ZM2.51089 1.39832C1.91907 1.39832 1.43929 1.86499 1.43929 2.44066L1.43927 21.556C1.43929 22.1317 1.91905 22.5983 2.51089 22.5983H33.7772C34.3691 22.5983 34.8489 22.1317 34.8489 21.556V2.44235C34.8489 1.86668 34.3691 1.39998 33.7772 1.39998L2.51089 1.39832Z" fill="black"></path>
                    <rect x="30.251" y="3.62793" width="2.308" height="16.8315" fill="black"></rect>
                    <rect x="26.7979" y="3.62793" width="2.308" height="14.5865" fill="black"></rect>
                    <rect x="9.49414" y="3.62793" width="2.308" height="14.5865" fill="black"></rect>
                    <rect x="21.0166" y="3.62793" width="2.308" height="14.5865" fill="black"></rect>
                    <rect x="15.2549" y="3.62793" width="3.37963" height="14.5865" fill="black"></rect>
                    <rect x="7.22266" y="3.62793" width="1.10805" height="14.5865" fill="black"></rect>
                    <rect x="12.9834" y="3.62793" width="1.10805" height="14.5865" fill="black"></rect>
                    <rect x="24.4902" y="3.62793" width="1.10805" height="14.5865" fill="black"></rect>
                    <rect x="3.71289" y="3.62793" width="2.308" height="16.8315" fill="black"></rect>
                  </svg>
                </li>
                <li class="payment-flag">
                  <svg width="73" height="22" viewBox="0 0 73 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.25415" width="72" height="22" rx="2" fill="#FAFAFA"/>
                    <path d="M7.23516 9.5V5.165H5.55516V4.2125H10.0852V5.165H8.40516V9.5H7.23516ZM10.0464 9.5V6.7025C10.0464 6.5375 10.0414 6.37 10.0314 6.2C10.0264 6.03 10.0139 5.8625 9.99387 5.6975H11.0814L11.2089 6.8075H11.0364C11.0864 6.5375 11.1664 6.315 11.2764 6.14C11.3914 5.965 11.5314 5.835 11.6964 5.75C11.8664 5.665 12.0589 5.6225 12.2739 5.6225C12.3689 5.6225 12.4439 5.6275 12.4989 5.6375C12.5539 5.6425 12.6089 5.655 12.6639 5.675L12.6564 6.6725C12.5514 6.6275 12.4614 6.6 12.3864 6.59C12.3164 6.575 12.2264 6.5675 12.1164 6.5675C11.9064 6.5675 11.7314 6.6075 11.5914 6.6875C11.4564 6.7675 11.3539 6.885 11.2839 7.04C11.2189 7.195 11.1864 7.3825 11.1864 7.6025V9.5H10.0464ZM14.5782 9.5825C14.2482 9.5825 13.9582 9.5025 13.7082 9.3425C13.4582 9.1825 13.2632 8.955 13.1232 8.66C12.9832 8.365 12.9132 8.01 12.9132 7.595C12.9132 7.185 12.9832 6.8325 13.1232 6.5375C13.2632 6.2425 13.4582 6.0175 13.7082 5.8625C13.9582 5.7025 14.2482 5.6225 14.5782 5.6225C14.8832 5.6225 15.1557 5.6975 15.3957 5.8475C15.6407 5.9925 15.8007 6.19 15.8757 6.44H15.7932L15.8832 5.6975H16.9707C16.9557 5.8625 16.9407 6.03 16.9257 6.2C16.9157 6.365 16.9107 6.5275 16.9107 6.6875V9.5H15.7857L15.7782 8.7875H15.8682C15.7882 9.0275 15.6282 9.22 15.3882 9.365C15.1482 9.51 14.8782 9.5825 14.5782 9.5825ZM14.9232 8.7275C15.1832 8.7275 15.3932 8.635 15.5532 8.45C15.7132 8.265 15.7932 7.98 15.7932 7.595C15.7932 7.21 15.7132 6.9275 15.5532 6.7475C15.3932 6.5675 15.1832 6.4775 14.9232 6.4775C14.6632 6.4775 14.4532 6.5675 14.2932 6.7475C14.1332 6.9275 14.0532 7.21 14.0532 7.595C14.0532 7.98 14.1307 8.265 14.2857 8.45C14.4457 8.635 14.6582 8.7275 14.9232 8.7275ZM17.8395 9.5V6.6875C17.8395 6.5275 17.8345 6.365 17.8245 6.2C17.8145 6.03 17.7995 5.8625 17.7795 5.6975H18.867L18.9495 6.4025H18.8595C18.9845 6.1525 19.162 5.96 19.392 5.825C19.622 5.69 19.8895 5.6225 20.1945 5.6225C20.6395 5.6225 20.972 5.7525 21.192 6.0125C21.417 6.2675 21.5295 6.665 21.5295 7.205V9.5H20.397V7.2575C20.397 6.9825 20.347 6.7875 20.247 6.6725C20.147 6.5575 19.997 6.5 19.797 6.5C19.547 6.5 19.347 6.58 19.197 6.74C19.047 6.895 18.972 7.105 18.972 7.37V9.5H17.8395ZM23.8416 9.5825C23.5016 9.5825 23.1916 9.545 22.9116 9.47C22.6316 9.395 22.3941 9.29 22.1991 9.155L22.4916 8.405C22.6866 8.525 22.9016 8.62 23.1366 8.69C23.3766 8.76 23.6141 8.795 23.8491 8.795C24.0691 8.795 24.2316 8.76 24.3366 8.69C24.4416 8.62 24.4941 8.525 24.4941 8.405C24.4941 8.305 24.4591 8.2275 24.3891 8.1725C24.3241 8.1175 24.2216 8.0775 24.0816 8.0525L23.3091 7.91C22.9841 7.845 22.7366 7.725 22.5666 7.55C22.3966 7.375 22.3116 7.1475 22.3116 6.8675C22.3116 6.6225 22.3766 6.4075 22.5066 6.2225C22.6416 6.0325 22.8341 5.885 23.0841 5.78C23.3341 5.675 23.6266 5.6225 23.9616 5.6225C24.2466 5.6225 24.5166 5.6575 24.7716 5.7275C25.0266 5.7975 25.2441 5.905 25.4241 6.05L25.1166 6.7775C24.9616 6.6625 24.7816 6.57 24.5766 6.5C24.3766 6.43 24.1841 6.395 23.9991 6.395C23.7591 6.395 23.5866 6.435 23.4816 6.515C23.3766 6.59 23.3241 6.6875 23.3241 6.8075C23.3241 6.8975 23.3541 6.9725 23.4141 7.0325C23.4791 7.0925 23.5766 7.1375 23.7066 7.1675L24.4866 7.31C24.8216 7.37 25.0766 7.4825 25.2516 7.6475C25.4266 7.8125 25.5141 8.04 25.5141 8.33C25.5141 8.595 25.4441 8.82 25.3041 9.005C25.1641 9.19 24.9666 9.3325 24.7116 9.4325C24.4616 9.5325 24.1716 9.5825 23.8416 9.5825ZM26.5034 9.5V6.545H25.7834V5.6975H26.8259L26.5034 5.99V5.4425C26.5034 4.9475 26.6309 4.575 26.8859 4.325C27.1459 4.075 27.5334 3.95 28.0484 3.95C28.1634 3.95 28.2859 3.9575 28.4159 3.9725C28.5509 3.9875 28.6684 4.0175 28.7684 4.0625V4.9325C28.6984 4.9075 28.6184 4.89 28.5284 4.88C28.4384 4.865 28.3509 4.8575 28.2659 4.8575C28.1509 4.8575 28.0434 4.8775 27.9434 4.9175C27.8484 4.9575 27.7709 5.025 27.7109 5.12C27.6559 5.21 27.6284 5.3325 27.6284 5.4875V5.885L27.4709 5.6975H28.5884V6.545H27.6359V9.5H26.5034ZM30.9361 9.5825C30.2761 9.5825 29.7611 9.405 29.3911 9.05C29.0211 8.695 28.8361 8.2125 28.8361 7.6025C28.8361 7.2075 28.9136 6.8625 29.0686 6.5675C29.2286 6.2725 29.4486 6.0425 29.7286 5.8775C30.0136 5.7075 30.3461 5.6225 30.7261 5.6225C31.1011 5.6225 31.4136 5.7025 31.6636 5.8625C31.9186 6.0225 32.1086 6.2475 32.2336 6.5375C32.3636 6.8225 32.4286 7.155 32.4286 7.535V7.7975H29.7661V7.235H31.6036L31.4761 7.34C31.4761 7.025 31.4111 6.7875 31.2811 6.6275C31.1561 6.4625 30.9736 6.38 30.7336 6.38C30.4686 6.38 30.2636 6.4775 30.1186 6.6725C29.9786 6.8675 29.9086 7.1475 29.9086 7.5125V7.6325C29.9086 8.0025 29.9986 8.2775 30.1786 8.4575C30.3636 8.6375 30.6286 8.7275 30.9736 8.7275C31.1786 8.7275 31.3711 8.7025 31.5511 8.6525C31.7361 8.5975 31.9111 8.5125 32.0761 8.3975L32.3911 9.1475C32.2011 9.2875 31.9811 9.395 31.7311 9.47C31.4861 9.545 31.2211 9.5825 30.9361 9.5825ZM33.1396 9.5V6.7025C33.1396 6.5375 33.1346 6.37 33.1246 6.2C33.1196 6.03 33.1071 5.8625 33.0871 5.6975H34.1746L34.3021 6.8075H34.1296C34.1796 6.5375 34.2596 6.315 34.3696 6.14C34.4846 5.965 34.6246 5.835 34.7896 5.75C34.9596 5.665 35.1521 5.6225 35.3671 5.6225C35.4621 5.6225 35.5371 5.6275 35.5921 5.6375C35.6471 5.6425 35.7021 5.655 35.7571 5.675L35.7496 6.6725C35.6446 6.6275 35.5546 6.6 35.4796 6.59C35.4096 6.575 35.3196 6.5675 35.2096 6.5675C34.9996 6.5675 34.8246 6.6075 34.6846 6.6875C34.5496 6.7675 34.4471 6.885 34.3771 7.04C34.3121 7.195 34.2796 7.3825 34.2796 7.6025V9.5H33.1396ZM38.0772 9.5825C37.4172 9.5825 36.9022 9.405 36.5322 9.05C36.1622 8.695 35.9772 8.2125 35.9772 7.6025C35.9772 7.2075 36.0547 6.8625 36.2097 6.5675C36.3697 6.2725 36.5897 6.0425 36.8697 5.8775C37.1547 5.7075 37.4872 5.6225 37.8672 5.6225C38.2422 5.6225 38.5547 5.7025 38.8047 5.8625C39.0597 6.0225 39.2497 6.2475 39.3747 6.5375C39.5047 6.8225 39.5697 7.155 39.5697 7.535V7.7975H36.9072V7.235H38.7447L38.6172 7.34C38.6172 7.025 38.5522 6.7875 38.4222 6.6275C38.2972 6.4625 38.1147 6.38 37.8747 6.38C37.6097 6.38 37.4047 6.4775 37.2597 6.6725C37.1197 6.8675 37.0497 7.1475 37.0497 7.5125V7.6325C37.0497 8.0025 37.1397 8.2775 37.3197 8.4575C37.5047 8.6375 37.7697 8.7275 38.1147 8.7275C38.3197 8.7275 38.5122 8.7025 38.6922 8.6525C38.8772 8.5975 39.0522 8.5125 39.2172 8.3975L39.5322 9.1475C39.3422 9.2875 39.1222 9.395 38.8722 9.47C38.6272 9.545 38.3622 9.5825 38.0772 9.5825ZM36.5547 5.3375L37.3872 3.8H38.3472L39.1797 5.3375H38.4822L37.8672 4.415L37.2522 5.3375H36.5547ZM40.2882 9.5V6.6875C40.2882 6.5275 40.2832 6.365 40.2732 6.2C40.2632 6.03 40.2482 5.8625 40.2282 5.6975H41.3157L41.3982 6.4025H41.3082C41.4332 6.1525 41.6107 5.96 41.8407 5.825C42.0707 5.69 42.3382 5.6225 42.6432 5.6225C43.0882 5.6225 43.4207 5.7525 43.6407 6.0125C43.8657 6.2675 43.9782 6.665 43.9782 7.205V9.5H42.8457V7.2575C42.8457 6.9825 42.7957 6.7875 42.6957 6.6725C42.5957 6.5575 42.4457 6.5 42.2457 6.5C41.9957 6.5 41.7957 6.58 41.6457 6.74C41.4957 6.895 41.4207 7.105 41.4207 7.37V9.5H40.2882ZM46.7179 9.5825C46.3129 9.5825 45.9579 9.5025 45.6529 9.3425C45.3479 9.1825 45.1129 8.9525 44.9479 8.6525C44.7829 8.3525 44.7004 7.9975 44.7004 7.5875C44.7004 7.1725 44.7829 6.82 44.9479 6.53C45.1179 6.235 45.3529 6.01 45.6529 5.855C45.9579 5.7 46.3129 5.6225 46.7179 5.6225C46.9729 5.6225 47.2204 5.66 47.4604 5.735C47.7054 5.81 47.9054 5.915 48.0604 6.05L47.7304 6.83C47.6054 6.715 47.4604 6.63 47.2954 6.575C47.1354 6.515 46.9804 6.485 46.8304 6.485C46.5254 6.485 46.2879 6.58 46.1179 6.77C45.9479 6.96 45.8629 7.235 45.8629 7.595C45.8629 7.955 45.9479 8.23 46.1179 8.42C46.2879 8.61 46.5254 8.705 46.8304 8.705C46.9754 8.705 47.1279 8.6775 47.2879 8.6225C47.4529 8.5675 47.6004 8.485 47.7304 8.375L48.0604 9.1475C47.9004 9.2825 47.6979 9.39 47.4529 9.47C47.2129 9.545 46.9679 9.5825 46.7179 9.5825ZM48.7038 9.5V5.6975H49.8363V9.5H48.7038ZM48.6588 5.075V4.0175H49.8738V5.075H48.6588ZM52.2394 9.5825C51.9094 9.5825 51.6194 9.5025 51.3694 9.3425C51.1194 9.1825 50.9244 8.955 50.7844 8.66C50.6444 8.365 50.5744 8.01 50.5744 7.595C50.5744 7.185 50.6444 6.8325 50.7844 6.5375C50.9244 6.2425 51.1194 6.0175 51.3694 5.8625C51.6194 5.7025 51.9094 5.6225 52.2394 5.6225C52.5444 5.6225 52.8169 5.6975 53.0569 5.8475C53.3019 5.9925 53.4619 6.19 53.5369 6.44H53.4544L53.5444 5.6975H54.6319C54.6169 5.8625 54.6019 6.03 54.5869 6.2C54.5769 6.365 54.5719 6.5275 54.5719 6.6875V9.5H53.4469L53.4394 8.7875H53.5294C53.4494 9.0275 53.2894 9.22 53.0494 9.365C52.8094 9.51 52.5394 9.5825 52.2394 9.5825ZM52.5844 8.7275C52.8444 8.7275 53.0544 8.635 53.2144 8.45C53.3744 8.265 53.4544 7.98 53.4544 7.595C53.4544 7.21 53.3744 6.9275 53.2144 6.7475C53.0544 6.5675 52.8444 6.4775 52.5844 6.4775C52.3244 6.4775 52.1144 6.5675 51.9544 6.7475C51.7944 6.9275 51.7144 7.21 51.7144 7.595C51.7144 7.98 51.7919 8.265 51.9469 8.45C52.1069 8.635 52.3194 8.7275 52.5844 8.7275ZM14.2963 17.5V12.2125H16.7338C17.3138 12.2125 17.7613 12.335 18.0763 12.58C18.3913 12.825 18.5488 13.16 18.5488 13.585C18.5488 13.9 18.4538 14.1675 18.2638 14.3875C18.0788 14.6075 17.8238 14.755 17.4988 14.83V14.71C17.8788 14.775 18.1713 14.92 18.3763 15.145C18.5863 15.365 18.6913 15.6525 18.6913 16.0075C18.6913 16.4775 18.5238 16.845 18.1888 17.11C17.8588 17.37 17.4013 17.5 16.8163 17.5H14.2963ZM15.4138 16.63H16.6738C16.9638 16.63 17.1863 16.575 17.3413 16.465C17.4963 16.355 17.5738 16.18 17.5738 15.94C17.5738 15.695 17.4963 15.52 17.3413 15.415C17.1863 15.305 16.9638 15.25 16.6738 15.25H15.4138V16.63ZM15.4138 14.3875H16.5238C16.8288 14.3875 17.0538 14.3325 17.1988 14.2225C17.3438 14.1125 17.4163 13.9475 17.4163 13.7275C17.4163 13.5125 17.3438 13.35 17.1988 13.24C17.0538 13.13 16.8288 13.075 16.5238 13.075H15.4138V14.3875ZM20.921 17.5825C20.591 17.5825 20.301 17.5025 20.051 17.3425C19.801 17.1825 19.606 16.955 19.466 16.66C19.326 16.365 19.256 16.01 19.256 15.595C19.256 15.185 19.326 14.8325 19.466 14.5375C19.606 14.2425 19.801 14.0175 20.051 13.8625C20.301 13.7025 20.591 13.6225 20.921 13.6225C21.226 13.6225 21.4985 13.6975 21.7385 13.8475C21.9835 13.9925 22.1435 14.19 22.2185 14.44H22.136L22.226 13.6975H23.3135C23.2985 13.8625 23.2835 14.03 23.2685 14.2C23.2585 14.365 23.2535 14.5275 23.2535 14.6875V17.5H22.1285L22.121 16.7875H22.211C22.131 17.0275 21.971 17.22 21.731 17.365C21.491 17.51 21.221 17.5825 20.921 17.5825ZM21.266 16.7275C21.526 16.7275 21.736 16.635 21.896 16.45C22.056 16.265 22.136 15.98 22.136 15.595C22.136 15.21 22.056 14.9275 21.896 14.7475C21.736 14.5675 21.526 14.4775 21.266 14.4775C21.006 14.4775 20.796 14.5675 20.636 14.7475C20.476 14.9275 20.396 15.21 20.396 15.595C20.396 15.98 20.4735 16.265 20.6285 16.45C20.7885 16.635 21.001 16.7275 21.266 16.7275ZM24.1823 17.5V14.6875C24.1823 14.5275 24.1773 14.365 24.1673 14.2C24.1573 14.03 24.1423 13.8625 24.1223 13.6975H25.2098L25.2923 14.4025H25.2023C25.3273 14.1525 25.5048 13.96 25.7348 13.825C25.9648 13.69 26.2323 13.6225 26.5373 13.6225C26.9823 13.6225 27.3148 13.7525 27.5348 14.0125C27.7598 14.2675 27.8723 14.665 27.8723 15.205V17.5H26.7398V15.2575C26.7398 14.9825 26.6898 14.7875 26.5898 14.6725C26.4898 14.5575 26.3398 14.5 26.1398 14.5C25.8898 14.5 25.6898 14.58 25.5398 14.74C25.3898 14.895 25.3148 15.105 25.3148 15.37V17.5H24.1823ZM30.6119 17.5825C30.2069 17.5825 29.8519 17.5025 29.5469 17.3425C29.2419 17.1825 29.0069 16.9525 28.8419 16.6525C28.6769 16.3525 28.5944 15.9975 28.5944 15.5875C28.5944 15.1725 28.6769 14.82 28.8419 14.53C29.0119 14.235 29.2469 14.01 29.5469 13.855C29.8519 13.7 30.2069 13.6225 30.6119 13.6225C30.8669 13.6225 31.1144 13.66 31.3544 13.735C31.5994 13.81 31.7994 13.915 31.9544 14.05L31.6244 14.83C31.4994 14.715 31.3544 14.63 31.1894 14.575C31.0294 14.515 30.8744 14.485 30.7244 14.485C30.4194 14.485 30.1819 14.58 30.0119 14.77C29.8419 14.96 29.7569 15.235 29.7569 15.595C29.7569 15.955 29.8419 16.23 30.0119 16.42C30.1819 16.61 30.4194 16.705 30.7244 16.705C30.8694 16.705 31.0219 16.6775 31.1819 16.6225C31.3469 16.5675 31.4944 16.485 31.6244 16.375L31.9544 17.1475C31.7944 17.2825 31.5919 17.39 31.3469 17.47C31.1069 17.545 30.8619 17.5825 30.6119 17.5825ZM34.0753 17.5825C33.7453 17.5825 33.4553 17.5025 33.2053 17.3425C32.9553 17.1825 32.7603 16.955 32.6203 16.66C32.4803 16.365 32.4103 16.01 32.4103 15.595C32.4103 15.185 32.4803 14.8325 32.6203 14.5375C32.7603 14.2425 32.9553 14.0175 33.2053 13.8625C33.4553 13.7025 33.7453 13.6225 34.0753 13.6225C34.3803 13.6225 34.6528 13.6975 34.8928 13.8475C35.1378 13.9925 35.2978 14.19 35.3728 14.44H35.2903L35.3803 13.6975H36.4678C36.4528 13.8625 36.4378 14.03 36.4228 14.2C36.4128 14.365 36.4078 14.5275 36.4078 14.6875V17.5H35.2828L35.2753 16.7875H35.3653C35.2853 17.0275 35.1253 17.22 34.8853 17.365C34.6453 17.51 34.3753 17.5825 34.0753 17.5825ZM34.4203 16.7275C34.6803 16.7275 34.8903 16.635 35.0503 16.45C35.2103 16.265 35.2903 15.98 35.2903 15.595C35.2903 15.21 35.2103 14.9275 35.0503 14.7475C34.8903 14.5675 34.6803 14.4775 34.4203 14.4775C34.1603 14.4775 33.9503 14.5675 33.7903 14.7475C33.6303 14.9275 33.5503 15.21 33.5503 15.595C33.5503 15.98 33.6278 16.265 33.7828 16.45C33.9428 16.635 34.1553 16.7275 34.4203 16.7275ZM34.0903 13.3375L34.8628 11.8H35.9428L34.8403 13.3375H34.0903ZM37.3291 17.5V14.7025C37.3291 14.5375 37.3241 14.37 37.3141 14.2C37.3091 14.03 37.2966 13.8625 37.2766 13.6975H38.3641L38.4916 14.8075H38.3191C38.3691 14.5375 38.4491 14.315 38.5591 14.14C38.6741 13.965 38.8141 13.835 38.9791 13.75C39.1491 13.665 39.3416 13.6225 39.5566 13.6225C39.6516 13.6225 39.7266 13.6275 39.7816 13.6375C39.8366 13.6425 39.8916 13.655 39.9466 13.675L39.9391 14.6725C39.8341 14.6275 39.7441 14.6 39.6691 14.59C39.5991 14.575 39.5091 14.5675 39.3991 14.5675C39.1891 14.5675 39.0141 14.6075 38.8741 14.6875C38.7391 14.7675 38.6366 14.885 38.5666 15.04C38.5016 15.195 38.4691 15.3825 38.4691 15.6025V17.5H37.3291ZM40.4201 17.5V13.6975H41.5526V17.5H40.4201ZM40.3751 13.075V12.0175H41.5901V13.075H40.3751ZM43.9557 17.5825C43.6257 17.5825 43.3357 17.5025 43.0857 17.3425C42.8357 17.1825 42.6407 16.955 42.5007 16.66C42.3607 16.365 42.2907 16.01 42.2907 15.595C42.2907 15.185 42.3607 14.8325 42.5007 14.5375C42.6407 14.2425 42.8357 14.0175 43.0857 13.8625C43.3357 13.7025 43.6257 13.6225 43.9557 13.6225C44.2607 13.6225 44.5332 13.6975 44.7732 13.8475C45.0182 13.9925 45.1782 14.19 45.2532 14.44H45.1707L45.2607 13.6975H46.3482C46.3332 13.8625 46.3182 14.03 46.3032 14.2C46.2932 14.365 46.2882 14.5275 46.2882 14.6875V17.5H45.1632L45.1557 16.7875H45.2457C45.1657 17.0275 45.0057 17.22 44.7657 17.365C44.5257 17.51 44.2557 17.5825 43.9557 17.5825ZM44.3007 16.7275C44.5607 16.7275 44.7707 16.635 44.9307 16.45C45.0907 16.265 45.1707 15.98 45.1707 15.595C45.1707 15.21 45.0907 14.9275 44.9307 14.7475C44.7707 14.5675 44.5607 14.4775 44.3007 14.4775C44.0407 14.4775 43.8307 14.5675 43.6707 14.7475C43.5107 14.9275 43.4307 15.21 43.4307 15.595C43.4307 15.98 43.5082 16.265 43.6632 16.45C43.8232 16.635 44.0357 16.7275 44.3007 16.7275Z" fill="black"/>
                    <path d="M63.061 8.19194V5.94717C63.061 5.61798 63.4364 5.42971 63.7002 5.62662L66.8248 7.95874C67.0391 8.11871 67.0391 8.43988 66.8248 8.59985L63.7002 10.932C63.4364 11.1289 63.061 10.9406 63.061 10.6114V8.19194Z" fill="#4D4D4D"/>
                    <path d="M58.9363 7.83359C58.9363 7.61268 59.1154 7.43359 59.3363 7.43359H63.3012V9.12777H59.3363C59.1154 9.12777 58.9363 8.94868 58.9363 8.72777V7.83359Z" fill="#4D4D4D"/>
                    <path d="M62.1295 13.8081L62.1295 16.0528C62.1295 16.382 61.754 16.5703 61.4902 16.3734L58.3657 14.0413C58.1513 13.8813 58.1513 13.5601 58.3657 13.4001L61.4902 11.068C61.754 10.8711 62.1295 11.0594 62.1295 11.3886L62.1295 13.8081Z" fill="#B2B2B2"/>
                    <path d="M66.2542 14.1664C66.2542 14.3873 66.0751 14.5664 65.8542 14.5664L61.8893 14.5664L61.8893 12.8722L65.8542 12.8722C66.0751 12.8722 66.2542 13.0513 66.2542 13.2722L66.2542 14.1664Z" fill="#B2B2B2"/>
                  </svg>
                </li>
                <li class="payment-flag">
                  <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg" id="pix">
                    <path d="M9.19739 21.7742L4.74695 17.4453H5.43958C6.35852 17.4453 7.22327 17.097 7.87317 16.4653L11.3998 13.0347C11.6464 12.7949 12.0765 12.7941 12.3231 13.0347L15.837 16.4526C16.4869 17.0847 17.3514 17.4328 18.2706 17.4328H18.694L14.2306 21.7742C13.5358 22.4501 12.6249 22.788 11.714 22.788C10.8031 22.788 9.89221 22.4501 9.19739 21.7742ZM1.0426 13.8421C-0.347534 12.4899 -0.347534 10.2979 1.0426 8.94615L3.75037 6.31224C3.80725 6.33306 3.86731 6.34787 3.93152 6.34787H5.43958C6.07336 6.34787 6.69397 6.59786 7.14197 7.0339L10.6691 10.4646C10.9979 10.7841 11.4296 10.9443 11.8615 10.9443C12.2933 10.9443 12.7252 10.7841 13.0541 10.4643L16.5682 7.04624C17.016 6.61036 17.6366 6.36022 18.2706 6.36022H19.4967C19.5646 6.36022 19.629 6.34571 19.6884 6.32258L22.3854 8.94615C23.7755 10.2979 23.7755 12.4899 22.3854 13.8421L19.6886 16.4654C19.629 16.4422 19.5646 16.4278 19.4967 16.4278H18.2706C17.6366 16.4278 17.016 16.1778 16.5682 15.7416L13.0541 12.3241C12.4171 11.7039 11.3063 11.7042 10.6688 12.3237L7.14197 15.7543C6.69397 16.1902 6.07336 16.4403 5.43958 16.4403H3.93152C3.86731 16.4403 3.80701 16.4551 3.75037 16.4759L1.0426 13.8421ZM11.3998 9.75387L7.87317 6.32286C7.22327 5.69101 6.35852 5.34276 5.43958 5.34276H4.74719L9.19739 1.01396C10.5873 -0.337987 12.8409 -0.337987 14.2306 1.01396L18.694 5.35525H18.2706C17.3514 5.35525 16.4869 5.70336 15.837 6.33538L12.3231 9.75357C12.1959 9.87774 12.0289 9.9396 11.8617 9.93959C11.6942 9.93959 11.527 9.87753 11.3998 9.75387Z" fill="#32BCAD"></path>
                  </svg>
                </li>
              </div>
            </ul>
          </div>

          <div class="copyright-container">
            <p class="copyright-text">
              Preços e condições exclusivos para o site www.lfmaquinaseferramentas.com.br, podendo sofrer alterações sem prévia notificação. LF Comercial de Bens LTDA /
              CNPJ: 91.845.735/0004-14. Rodovia BR 116, Nº 5003 – Bairro Travessão - Dois Irmãos - RS / CEP 93950-000 / Telefone: (51) 3103-0100
            </p>
          </div>
        </div>

        <div class="logos-container">
          <ul class="logos-list">
            <li class="bottom-logo">
              <a
                href="https://www.lojaconfiavel.com/lfmaquinaseferramentas"
                class="ts-footerstamp"
                data-lcname="lfmaquinaseferramentas"
                target="_blank"
              >
                <img
                  src="//service.yourviews.com.br/Image/0b9ba72d-47e2-4792-8450-2530d4dd92f8/Footer.jpg"
                  title="Loja Confiável"
                  alt="Loja Confiável"
                  width="88"
                  height="91"
                />
              </a> 
            </li>
            <div id="reputation-ra" class="bottom-logo"></div>
            <li class="bottom-logo">
              <a
                id="seloEconfy"
                href="https://confi.com.vc/app/lojas-confiaveis?id=112664"
                target="_blank"
                data-noop="redir(this.href);"
              >
                <img src="https://cdn.confi.com.vc/reputation/112664.png" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  </footer>
  `

  footer.replaceWith(newFooter)
}

function addRaScript() {
  const script = document.createElement('script')
  script.src = 'https://s3.amazonaws.com/raichu-beta/selos/bundle.js'
  script.id = 'ra-embed-reputation'
  script.setAttribute('data-id', 'dGwtQ05xbUhqdV9nVlRqbzpsZi1tYXF1aW5hcy1lLWZlcnJhbWVudGFz')
  script.setAttribute('data-target', 'reputation-ra')
  script.setAttribute('data-model', '1')
  document.body.appendChild(script)
}
