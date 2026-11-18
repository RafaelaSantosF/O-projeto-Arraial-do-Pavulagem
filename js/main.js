document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const menuLinks = document.getElementById('menu-links');

if (menuToggle && menuLinks) {
  const fecharMenu = () => {
    menuLinks.classList.remove('aberto');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
  };

  menuToggle.addEventListener('click', () => {
    const aberto = menuLinks.classList.toggle('aberto');
    menuToggle.setAttribute('aria-expanded', String(aberto));
    menuToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  menuLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', fecharMenu);
  });
}

const voltarTopo = document.querySelector('.voltar-topo');

if (voltarTopo) {
  const atualizarBotao = () => {
    voltarTopo.classList.toggle('visivel', window.scrollY > 400);
  };

  atualizarBotao();
  window.addEventListener('scroll', atualizarBotao, { passive: true });

  voltarTopo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const secoes = document.querySelectorAll('main section[id]');
const linksMenu = document.querySelectorAll('.menu-links a');

if ('IntersectionObserver' in window && secoes.length && linksMenu.length) {
  const observerSecoes = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          linksMenu.forEach((link) => {
            link.classList.toggle(
              'ativo',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  secoes.forEach((secao) => observerSecoes.observe(secao));
}

const elementosRevelar = document.querySelectorAll('.revelar');

if (elementosRevelar.length) {
  if ('IntersectionObserver' in window) {
    const observerRevelar = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visivel');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elementosRevelar.forEach((el) => observerRevelar.observe(el));
  } else {
    elementosRevelar.forEach((el) => el.classList.add('visivel'));
  }
}

const galeriaTrilha = document.querySelector('.galeria-trilha');
const botoesGaleria = Array.from(document.querySelectorAll('.galeria-abrir'));
const lightbox = document.querySelector('.lightbox');

if (galeriaTrilha && botoesGaleria.length) {
  botoesGaleria.forEach((botao) => {
    const item = botao.closest('.galeria-item');
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('button, a, [tabindex]').forEach((el) => {
      el.setAttribute('tabindex', '-1');
    });
    galeriaTrilha.appendChild(clone);
  });
}

if (lightbox && botoesGaleria.length) {
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxLegenda = lightbox.querySelector('.lightbox-legenda');
  const lightboxFechar = lightbox.querySelector('.lightbox-fechar');
  const lightboxAnterior = lightbox.querySelector('.lightbox-anterior');
  const lightboxProxima = lightbox.querySelector('.lightbox-proxima');

  const imagensGaleria = botoesGaleria.map((botao) => ({
    src: botao.dataset.src,
    legenda: botao.dataset.legenda,
  }));

  let indiceAtual = 0;
  let botaoOrigem = null;

  const atualizarLightbox = () => {
    const imagem = imagensGaleria[indiceAtual];
    lightboxImg.src = imagem.src;
    lightboxImg.alt = imagem.legenda;
    lightboxLegenda.textContent = imagem.legenda;
  };

  const abrirLightbox = (indice, botao) => {
    indiceAtual = indice;
    botaoOrigem = botao || null;
    atualizarLightbox();
    document.body.classList.add('lightbox-aberto');

    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
    } else {
      lightbox.setAttribute('open', '');
    }
  };

  const fecharLightbox = () => {
    if (typeof lightbox.close === 'function') {
      lightbox.close();
    } else {
      lightbox.removeAttribute('open');
      document.body.classList.remove('lightbox-aberto');
    }
  };

  const navegarLightbox = (direcao) => {
    indiceAtual = (indiceAtual + direcao + imagensGaleria.length) % imagensGaleria.length;
    atualizarLightbox();
  };

  galeriaTrilha.addEventListener('click', (event) => {
    const botao = event.target.closest('.galeria-abrir');

    if (!botao) {
      return;
    }

    const indice = imagensGaleria.findIndex((imagem) => imagem.src === botao.dataset.src);
    const indiceSeguro = indice >= 0 ? indice : 0;
    abrirLightbox(indiceSeguro, botoesGaleria[indiceSeguro]);
  });

  lightboxFechar.addEventListener('click', fecharLightbox);
  lightboxAnterior.addEventListener('click', () => navegarLightbox(-1));
  lightboxProxima.addEventListener('click', () => navegarLightbox(1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      fecharLightbox();
    }
  });

  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navegarLightbox(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navegarLightbox(1);
    }
  });

  lightbox.addEventListener('close', () => {
    document.body.classList.remove('lightbox-aberto');

    if (botaoOrigem) {
      botaoOrigem.focus({ preventScroll: true });
      botaoOrigem = null;
    }
  });
}

const simbolosBotoes = document.querySelectorAll('.simbolo-botao');

simbolosBotoes.forEach((botao) => {
  const detalhe = document.getElementById(botao.getAttribute('aria-controls'));

  if (!detalhe) {
    return;
  }

  botao.addEventListener('click', () => {
    const aberto = botao.getAttribute('aria-expanded') === 'true';

    simbolosBotoes.forEach((outroBotao) => {
      const outroDetalhe = document.getElementById(outroBotao.getAttribute('aria-controls'));
      outroBotao.setAttribute('aria-expanded', 'false');

      if (outroDetalhe) {
        outroDetalhe.hidden = true;
      }
    });

    if (!aberto) {
      botao.setAttribute('aria-expanded', 'true');
      detalhe.hidden = false;
    }
  });
});
