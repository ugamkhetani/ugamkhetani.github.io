# -*- coding: utf-8 -*-

def split_title(t):
    w = t.split()
    if len(w) == 1:
        return t, ''
    h = (len(w) + 1) // 2
    return ' '.join(w[:h]), ' '.join(w[h:])

CARDS_TPL = '''          {CARDS.%s.map((c, i) => (
            <div class={`wv__card wv__card--${i}`} data-reveal style={`--i:${i + 3}`}>
              <Still
                slug={c.w.id} title={c.w.data.title} year={c.w.data.year}
                category={c.w.data.category} ratio={c.w.data.ratio}
                frames={c.w.data.frames} alt={c.w.data.alt}
                sizes="26vw" eager={true} max={1} free={true}
              />
            </div>
          ))}'''

def STAGE(key, a, b, aid=None, hero=False):
    """The weave stage: cards absolutely placed, the heading split into two
    segments so cards can sit BETWEEN them in z rather than only over or under."""
    idattr = ' id="%s"' % aid if aid else ''
    tag = 'p' if hero else 'h2'
    wcls = 'wv__w wv__w--hero' if hero else 'wv__w'
    seg_b = ('''
            <span class="wv__seg wv__seg--b" data-reveal style="--i:2">%s</span>''' % b) if b else ''
    return '''      <div class="wv__stage%s">
%s
        <%s class="%s"%s>
            <span class="wv__seg wv__seg--a" data-reveal style="--i:1">%s</span>%s
        </%s>
      </div>''' % (' wv__stage--hero' if hero else '', CARDS_TPL % key,
                   tag, wcls, idattr, a, seg_b, tag)

CAP_AND_EDGE = r'''
      <h1 class="wv__cap">
        {STMT_PAIR.map((ln, i) => (
          <span class="line" data-reveal style={`--i:${i + 6}`}>
            <span class="line__in">
              {ln.map((word, k) => (
                <Fragment>
                  {k > 0 ? ' ' : ''}
                  {word.accent ? <em class="hot serif">{word.w}</em> : word.w}
                </Fragment>
              ))}
            </span>
          </span>
        ))}
      </h1>

      <div class="wv__edge" data-reveal style="--i:8">
        <span class="mono">{total} works</span>
        <span class="mono">{HERO.role.join(' / ')}</span>
        <span class="mono">{HERO.place[0]}</span>
        <span class="mono ov__cue">Scroll &darr;</span>
      </div>
    </header>'''

def make_head(kind):
    def head(n, title, folio, aid, over=False):
        a, b = split_title(title)
        key = 'm%d' % (int(n) - 1)
        return '''      <div class="wv__lab%s">
        <span class="mono wv__n">%s</span>
        <span class="mono wv__folio">%s</span>
      </div>
%s''' % (' wv__lab--over' if over else '', n, folio, STAGE(key, a, b, aid))
    return head

def make_hdr(kind):
    return (r'''    <header class="ov ov--%s" id="about">
      <div class="wv__lab">
        <span class="mono wv__n">00</span>
        <span class="mono wv__folio">00/05 &nbsp;&middot;&nbsp; {RANGE}</span>
      </div>
''' % kind) + STAGE('hero', '{NAME_PARTS[0]}', '{NAME_PARTS[1]}', hero=True) + CAP_AND_EDGE

STYLES = {k: dict(head=make_head(k), hdr=make_hdr(k)) for k in ('dr', 'fo', 'ti')}
