import { ETFInfo } from '@/types';

export const CATEGORY_COLORS: Record<string, string> = {
  '나스닥/S&P': 'bg-blue-100 text-blue-700',
  '배당/인컴': 'bg-green-100 text-green-700',
  '섹터': 'bg-purple-100 text-purple-700',
  '채권/안전자산': 'bg-yellow-100 text-yellow-700',
  '레버리지': 'bg-red-100 text-red-700',
  '글로벌': 'bg-orange-100 text-orange-700',
};

export const CATEGORY_EMOJI: Record<string, string> = {
  '나스닥/S&P': '📈',
  '배당/인컴': '💰',
  '섹터': '🏭',
  '채권/안전자산': '🛡️',
  '레버리지': '⚡',
  '글로벌': '🌍',
};

export const ETF_LIST: ETFInfo[] = [
  // 나스닥/S&P 핵심
  {
    ticker: 'QQQ', name_ko: '인베스코 나스닥 100', name_en: 'Invesco QQQ Trust', category: '나스닥/S&P',
    expense_ratio: 0.20,
    description: '나스닥 100 지수를 추종하는 ETF로, 애플·마이크로소프트·엔비디아 등 미국 대형 기술주 100개에 투자합니다. 기술 섹터 비중이 높아 장기 성장성이 뛰어나지만 변동성도 큰 편입니다. 1999년 설정된 가장 오래된 나스닥 ETF 중 하나입니다.',
  },
  {
    ticker: 'QLD', name_ko: '프로셰어즈 울트라 QQQ (2x)', name_en: 'ProShares Ultra QQQ', category: '레버리지',
    expense_ratio: 0.95,
    description: '나스닥 100 지수 일일 수익률의 2배를 추종하는 레버리지 ETF입니다. 상승장에서 QQQ 대비 2배의 수익을 기대할 수 있지만, 하락장에서도 2배로 손실이 납니다. 장기 보유 시 변동성 손실(volatility decay)이 발생하므로 주의가 필요합니다.',
  },
  {
    ticker: 'TQQQ', name_ko: '프로셰어즈 울트라프로 QQQ (3x)', name_en: 'ProShares UltraPro QQQ', category: '레버리지',
    expense_ratio: 0.88,
    description: '나스닥 100 지수 일일 수익률의 3배를 추종합니다. 단기 트레이딩 목적으로 설계된 상품으로, 상승장에서는 폭발적인 수익이 가능하지만 횡보·하락장에서는 원금 손실이 매우 빠르게 진행됩니다. 장기 적립식 투자에는 부적합하다는 견해가 많습니다.',
  },
  {
    ticker: 'SPY', name_ko: 'SPDR S&P 500', name_en: 'SPDR S&P 500 ETF Trust', category: '나스닥/S&P',
    expense_ratio: 0.0945,
    description: '1993년 출시된 세계 최초의 ETF로, S&P 500 지수를 추종합니다. 미국 대형주 500개를 시가총액 가중 방식으로 담아 미국 주식 시장의 대표 지수로 활용됩니다. 운용 자산 규모가 세계 최대 수준이며 유동성이 풍부합니다.',
  },
  {
    ticker: 'VOO', name_ko: '뱅가드 S&P 500', name_en: 'Vanguard S&P 500 ETF', category: '나스닥/S&P',
    expense_ratio: 0.03,
    description: '뱅가드가 운용하는 S&P 500 ETF로, SPY·IVV와 동일한 지수를 추종하지만 수수료가 0.03%로 매우 저렴합니다. 장기 투자자에게 인기 있으며, 워런 버핏이 유언장에 S&P 500 인덱스 펀드 투자를 권고한 것으로 유명합니다.',
  },
  {
    ticker: 'IVV', name_ko: 'iShares 코어 S&P 500', name_en: 'iShares Core S&P 500 ETF', category: '나스닥/S&P',
    expense_ratio: 0.03,
    description: 'BlackRock의 iShares가 운용하는 S&P 500 ETF입니다. VOO와 동일하게 수수료가 0.03%로 낮으며, SPY 대비 배당 재투자 효율이 높은 편입니다. 장기 코어 자산으로 적합한 상품입니다.',
  },
  {
    ticker: 'VTI', name_ko: '뱅가드 전체 미국 시장', name_en: 'Vanguard Total Stock Market ETF', category: '나스닥/S&P',
    expense_ratio: 0.03,
    description: '미국 증시에 상장된 대·중·소형주를 망라한 약 3,600개 종목에 투자합니다. S&P 500 외에 중소형주까지 포함해 미국 경제 전체에 투자하는 효과가 있습니다. 분산 투자의 정석으로 불리는 ETF입니다.',
  },
  {
    ticker: 'DIA', name_ko: 'SPDR 다우존스 산업평균', name_en: 'SPDR Dow Jones Industrial Average ETF', category: '나스닥/S&P',
    expense_ratio: 0.16,
    description: '다우존스 산업평균지수를 추종하는 ETF로, 미국을 대표하는 전통 우량 기업 30개에 투자합니다. 주가 가중 방식을 사용하므로 고가 주식의 영향을 많이 받습니다. 매월 배당금을 지급하는 것이 특징입니다.',
  },
  {
    ticker: 'IWM', name_ko: 'iShares 러셀 2000', name_en: 'iShares Russell 2000 ETF', category: '나스닥/S&P',
    expense_ratio: 0.19,
    description: '미국 소형주 지수인 러셀 2000을 추종합니다. 대형주 대비 경기 민감도가 높고 변동성이 크지만, 경기 회복기에 높은 수익을 기대할 수 있습니다. 미국 내수 경제의 활력을 반영하는 지표로도 사용됩니다.',
  },
  {
    ticker: 'ONEQ', name_ko: '피델리티 나스닥 컴포지트', name_en: 'Fidelity Nasdaq Composite Index ETF', category: '나스닥/S&P',
    expense_ratio: 0.21,
    description: '나스닥 종합지수(Composite)를 추종하여 나스닥에 상장된 약 3,000개 이상의 종목에 투자합니다. QQQ(나스닥 100)보다 더 넓은 범위를 커버하며 중소형 기술주도 포함됩니다.',
  },
  // 배당/인컴
  {
    ticker: 'SCHD', name_ko: '슈왑 미국 배당주', name_en: 'Schwab US Dividend Equity ETF', category: '배당/인컴',
    expense_ratio: 0.06,
    description: '미국 배당주 ETF 중 가장 인기 있는 상품 중 하나입니다. 10년 이상 배당 지급 이력을 가진 기업 중 재무 건전성이 우수한 약 100개 종목을 선별합니다. 배당 성장률과 수익률이 균형 잡혀 있으며, 분기 배당을 지급합니다.',
  },
  {
    ticker: 'JEPI', name_ko: 'JP모건 프리미엄 인컴', name_en: 'JPMorgan Equity Premium Income ETF', category: '배당/인컴',
    expense_ratio: 0.35,
    description: 'S&P 500 종목 + 커버드콜 전략으로 연 6~9%대의 높은 월 배당을 목표로 합니다. 옵션 프리미엄을 활용해 안정적인 인컴을 제공하지만, 주가 상승 시 수익이 제한될 수 있습니다. 은퇴 후 현금흐름이 필요한 투자자에게 인기가 많습니다.',
  },
  {
    ticker: 'JEPQ', name_ko: 'JP모건 나스닥 프리미엄 인컴', name_en: 'JPMorgan Nasdaq Equity Premium Income ETF', category: '배당/인컴',
    expense_ratio: 0.35,
    description: 'JEPI의 나스닥 버전입니다. 나스닥 100 종목 기반에 커버드콜 전략을 결합해 고배당을 추구합니다. JEPI 대비 기술주 비중이 높아 성장성과 인컴을 동시에 기대할 수 있지만 변동성도 더 큽니다.',
  },
  {
    ticker: 'VIG', name_ko: '뱅가드 배당 성장주', name_en: 'Vanguard Dividend Appreciation ETF', category: '배당/인컴',
    expense_ratio: 0.06,
    description: '10년 이상 연속 배당 인상 이력을 가진 기업에 투자합니다. 현재 배당 수익률보다 배당 성장률에 초점을 맞춰, 장기 보유 시 배당금이 꾸준히 늘어나는 구조입니다. 마이크로소프트·애플·UNH 등 우량 기업 비중이 높습니다.',
  },
  {
    ticker: 'VYM', name_ko: '뱅가드 고배당 수익률', name_en: 'Vanguard High Dividend Yield ETF', category: '배당/인컴',
    expense_ratio: 0.06,
    description: '시가 배당률이 높은 미국 대형주 약 400개에 투자합니다. VIG보다 현재 배당 수익률이 높으며, 금융·헬스케어·에너지 섹터 비중이 큽니다. 안정적인 인컴을 원하는 투자자에게 적합합니다.',
  },
  {
    ticker: 'DGRO', name_ko: 'iShares 코어 배당 성장', name_en: 'iShares Core Dividend Growth ETF', category: '배당/인컴',
    expense_ratio: 0.08,
    description: '5년 이상 배당 성장 이력을 가진 기업 중 배당성향이 75% 이하인 종목을 선별합니다. VIG와 유사하지만 더 많은 종목을 포함하며 기술주 비중이 조금 더 높습니다. 성장성과 배당을 동시에 추구하는 균형 잡힌 ETF입니다.',
  },
  {
    ticker: 'SPHD', name_ko: 'S&P 500 고배당 저변동성', name_en: 'Invesco S&P 500 High Dividend Low Volatility ETF', category: '배당/인컴',
    expense_ratio: 0.30,
    description: 'S&P 500 내에서 배당 수익률이 높으면서 변동성이 낮은 50개 종목을 선별합니다. 하락장에서 상대적으로 방어력이 있으며 매월 배당을 지급합니다. 유틸리티·부동산·소비재 섹터 비중이 높아 금리 변화에 민감합니다.',
  },
  {
    ticker: 'QYLD', name_ko: '글로벌X 나스닥 커버드콜', name_en: 'Global X NASDAQ 100 Covered Call ETF', category: '배당/인컴',
    expense_ratio: 0.60,
    description: '나스닥 100 지수를 보유하면서 콜옵션을 매도해 프리미엄 수입을 배당으로 지급합니다. 연 10~12% 수준의 높은 월 배당이 특징이지만, 주가 상승 시 수익이 제한되어 장기적으로 원금 보존이 어려울 수 있습니다.',
  },
  {
    ticker: 'XYLD', name_ko: '글로벌X S&P500 커버드콜', name_en: 'Global X S&P 500 Covered Call ETF', category: '배당/인컴',
    expense_ratio: 0.60,
    description: 'QYLD의 S&P 500 버전입니다. S&P 500을 보유하면서 커버드콜 전략으로 월 배당을 지급합니다. QYLD보다 변동성이 낮지만 배당 수익률도 다소 낮습니다. 고배당 월 현금흐름이 필요한 투자자에게 적합합니다.',
  },
  {
    ticker: 'HDV', name_ko: 'iShares 코어 고배당', name_en: 'iShares Core High Dividend ETF', category: '배당/인컴',
    expense_ratio: 0.08,
    description: '재무 건전성이 높은 미국 고배당 기업 약 75개에 투자합니다. 에너지·헬스케어·통신 섹터 비중이 높으며, VYM과 유사하지만 종목 수가 적어 집중도가 높습니다. 배당 수익률 대비 수수료가 낮아 효율적인 인컴 ETF입니다.',
  },
  // 섹터
  {
    ticker: 'XLK', name_ko: 'SPDR 기술주', name_en: 'Technology Select Sector SPDR Fund', category: '섹터',
    expense_ratio: 0.09,
    description: 'S&P 500 내 기술 섹터 종목만을 담은 ETF입니다. 애플·마이크로소프트·엔비디아가 상위 비중을 차지합니다. QQQ와 비슷하지만 통신·임의소비재 섹터는 제외되어 순수 기술주에 집중됩니다.',
  },
  {
    ticker: 'SMH', name_ko: '반도체 ETF', name_en: 'VanEck Semiconductor ETF', category: '섹터',
    expense_ratio: 0.35,
    description: '세계 주요 반도체 기업 25개에 투자합니다. 엔비디아·TSMC·ASML 등 글로벌 반도체 가치사슬 전반을 커버합니다. AI 붐으로 반도체 수요가 급증하면서 주목받고 있으며, 글로벌 반도체 기업도 포함하는 것이 SOXX와의 차이점입니다.',
  },
  {
    ticker: 'SOXX', name_ko: 'iShares 반도체', name_en: 'iShares Semiconductor ETF', category: '섹터',
    expense_ratio: 0.35,
    description: '미국에 상장된 반도체 설계·제조·장비 기업 약 30개에 투자합니다. 엔비디아·브로드컴·퀄컴 등 미국 반도체 기업 중심이며, SMH 대비 미국 기업 비중이 더 높습니다. AI·데이터센터 성장의 수혜를 기대하는 투자자에게 적합합니다.',
  },
  {
    ticker: 'XLE', name_ko: 'SPDR 에너지', name_en: 'Energy Select Sector SPDR Fund', category: '섹터',
    expense_ratio: 0.09,
    description: 'S&P 500의 에너지 섹터를 담은 ETF로, 엑슨모빌·셰브론 등 미국 주요 에너지 기업에 투자합니다. 유가와 높은 상관관계를 보이며, 인플레이션 헤지 수단으로도 활용됩니다. 배당 수익률이 상대적으로 높은 편입니다.',
  },
  {
    ticker: 'XLF', name_ko: 'SPDR 금융주', name_en: 'Financial Select Sector SPDR Fund', category: '섹터',
    expense_ratio: 0.09,
    description: 'S&P 500의 금융 섹터 ETF로, JP모건·뱅크오브아메리카·버크셔헤서웨이 등에 투자합니다. 금리 상승기에 수혜를 받는 경향이 있으며, 경기 사이클에 민감하게 반응합니다.',
  },
  {
    ticker: 'XLV', name_ko: 'SPDR 헬스케어', name_en: 'Health Care Select Sector SPDR Fund', category: '섹터',
    expense_ratio: 0.09,
    description: 'S&P 500의 헬스케어 섹터 ETF로, 존슨앤존슨·유나이티드헬스·일라이릴리 등에 투자합니다. 경기 방어적 섹터로 경기 침체기에도 상대적으로 안정적인 모습을 보입니다. 고령화 사회 진입으로 장기 성장성이 기대됩니다.',
  },
  {
    ticker: 'XLI', name_ko: 'SPDR 산업재', name_en: 'Industrial Select Sector SPDR Fund', category: '섹터',
    expense_ratio: 0.09,
    description: 'S&P 500의 산업재 섹터로, 항공우주·방산·건설장비·물류 기업에 투자합니다. 경기 확장기에 수혜를 받으며, 인프라 투자 확대와 리쇼어링 트렌드의 수혜가 예상됩니다.',
  },
  {
    ticker: 'XLRE', name_ko: 'SPDR 부동산', name_en: 'Real Estate Select Sector SPDR Fund', category: '섹터',
    expense_ratio: 0.09,
    description: 'S&P 500의 리츠(REITs) 및 부동산 기업에 투자합니다. 임대료 수입 기반의 안정적인 배당이 특징이며, 금리 민감도가 높아 금리 하락기에 유리합니다. 데이터센터·물류창고 등 신형 리츠도 포함됩니다.',
  },
  {
    ticker: 'XLY', name_ko: 'SPDR 임의소비재', name_en: 'Consumer Discretionary Select Sector SPDR Fund', category: '섹터',
    expense_ratio: 0.09,
    description: 'S&P 500의 임의소비재 섹터로, 아마존·테슬라·홈디포 등에 투자합니다. 경기 민감 섹터로 소비 심리가 좋을 때 높은 수익을 기대할 수 있습니다. 아마존·테슬라의 비중이 높아 두 종목의 영향을 크게 받습니다.',
  },
  {
    ticker: 'XLC', name_ko: 'SPDR 통신서비스', name_en: 'Communication Services Select Sector SPDR Fund', category: '섹터',
    expense_ratio: 0.09,
    description: 'S&P 500의 통신서비스 섹터로, 메타·알파벳·넷플릭스·버라이즌 등에 투자합니다. 소셜미디어·스트리밍·광고 등 디지털 미디어 비중이 높으며, 전통 통신사와 빅테크의 혼합 형태입니다.',
  },
  // 채권/안전자산
  {
    ticker: 'TLT', name_ko: 'iShares 20년+ 미국채', name_en: 'iShares 20+ Year Treasury Bond ETF', category: '채권/안전자산',
    expense_ratio: 0.15,
    description: '만기 20년 이상의 미국 장기 국채에 투자합니다. 금리 변화에 매우 민감하게 반응하며, 금리 하락 시 가격이 크게 상승합니다. 주식과 음의 상관관계를 보이는 경우가 많아 포트폴리오 헤지 수단으로 활용됩니다.',
  },
  {
    ticker: 'AGG', name_ko: 'iShares 코어 미국 채권', name_en: 'iShares Core U.S. Aggregate Bond ETF', category: '채권/안전자산',
    expense_ratio: 0.03,
    description: '미국 투자등급 채권 시장 전체를 추종합니다. 국채·회사채·주택담보부증권 등 8,000개 이상의 채권을 포함합니다. 포트폴리오 안정성을 높이는 코어 채권 자산으로 널리 활용됩니다.',
  },
  {
    ticker: 'BND', name_ko: '뱅가드 전체 채권 시장', name_en: 'Vanguard Total Bond Market ETF', category: '채권/안전자산',
    expense_ratio: 0.03,
    description: '미국 투자등급 채권 시장을 대표하는 AGG와 유사한 ETF입니다. 뱅가드 운용으로 낮은 수수료가 장점이며, 단기~장기 채권을 고루 담아 금리 리스크를 분산합니다. 주식과 함께 포트폴리오의 안정 자산으로 자주 활용됩니다.',
  },
  {
    ticker: 'SHY', name_ko: 'iShares 1-3년 미국채', name_en: 'iShares 1-3 Year Treasury Bond ETF', category: '채권/안전자산',
    expense_ratio: 0.15,
    description: '만기 1~3년의 단기 미국 국채에 투자합니다. 금리 변화에 가장 덜 민감하여 현금 대용으로 활용하거나, 시장 불확실성이 높을 때 안전 자산 피난처로 쓰입니다. 변동성이 매우 낮은 것이 특징입니다.',
  },
  {
    ticker: 'LQD', name_ko: 'iShares 투자등급 회사채', name_en: 'iShares iBoxx $ Investment Grade Corporate Bond ETF', category: '채권/안전자산',
    expense_ratio: 0.14,
    description: '투자등급(BBB- 이상) 미국 회사채 1,000개 이상에 투자합니다. 국채보다 높은 금리(스프레드)를 제공하며 수익률이 더 높습니다. 신용 리스크가 일부 있지만 경기 침체기에도 비교적 안정적인 수익을 기대할 수 있습니다.',
  },
  {
    ticker: 'HYG', name_ko: 'iShares 하이일드 회사채', name_en: 'iShares iBoxx $ High Yield Corporate Bond ETF', category: '채권/안전자산',
    expense_ratio: 0.49,
    description: '투기등급(BB 이하) 고금리 회사채에 투자합니다. 국채·투자등급 채권 대비 높은 수익률을 제공하지만 신용 리스크가 높습니다. 주식과의 상관관계가 높아 주식 대안으로는 부적합하지만 고인컴을 원하는 투자자에게 적합합니다.',
  },
  {
    ticker: 'GLD', name_ko: 'SPDR 금', name_en: 'SPDR Gold Shares', category: '채권/안전자산',
    expense_ratio: 0.40,
    description: '실물 금에 직접 투자하는 세계 최대 금 ETF입니다. 달러 약세·인플레이션·지정학적 위기 시 안전 자산 역할을 합니다. 금을 직접 보관하는 번거로움 없이 금 가격에 연동된 투자가 가능합니다.',
  },
  {
    ticker: 'IAU', name_ko: 'iShares 금', name_en: 'iShares Gold Trust', category: '채권/안전자산',
    expense_ratio: 0.25,
    description: 'GLD와 동일하게 실물 금에 투자하지만 수수료가 0.25%로 더 저렴합니다. GLD 대비 주당 가격이 낮아 소액 투자자에게 유리합니다. 장기 금 투자를 고려한다면 수수료 측면에서 GLD보다 유리한 선택입니다.',
  },
  // 레버리지/인버스
  {
    ticker: 'UPRO', name_ko: 'S&P500 3배 레버리지', name_en: 'ProShares UltraPro S&P 500', category: '레버리지',
    expense_ratio: 0.91,
    description: 'S&P 500 일일 수익률의 3배를 추종합니다. TQQQ의 S&P 500 버전으로, 상승장에서 3배의 수익을 기대하지만 하락 시 손실도 3배입니다. 매일 리밸런싱되어 장기 보유 시 지수 대비 수익이 달라질 수 있습니다.',
  },
  {
    ticker: 'SPXL', name_ko: 'S&P500 3배 레버리지 (디렉시온)', name_en: 'Direxion Daily S&P 500 Bull 3X Shares', category: '레버리지',
    expense_ratio: 0.91,
    description: 'UPRO와 동일하게 S&P 500의 3배 수익을 추종하는 디렉시온의 레버리지 ETF입니다. UPRO와 구조는 유사하지만 운용사가 다르며, 소폭의 트래킹 차이가 있을 수 있습니다.',
  },
  {
    ticker: 'SOXL', name_ko: '반도체 3배 레버리지', name_en: 'Direxion Daily Semiconductor Bull 3x Shares', category: '레버리지',
    expense_ratio: 0.75,
    description: '필라델피아 반도체 지수(SOX)의 3배 일일 수익률을 추종합니다. 반도체 업황과 AI 테마에 고배율로 베팅하는 상품으로, 상승 시 엄청난 수익이 가능하지만 반도체 사이클 하락 시 큰 손실을 입을 수 있습니다.',
  },
  {
    ticker: 'TECL', name_ko: '기술주 3배 레버리지', name_en: 'Direxion Daily Technology Bull 3X Shares', category: '레버리지',
    expense_ratio: 0.94,
    description: '기술 섹터 지수(XLK)의 3배 일일 수익률을 추종합니다. 기술주 상승세에 레버리지로 베팅하는 상품이며, 변동성이 매우 높습니다. 단기 전술적 투자 외에는 리스크 관리가 어렵습니다.',
  },
  {
    ticker: 'SQQQ', name_ko: '나스닥 3배 인버스', name_en: 'ProShares UltraPro Short QQQ', category: '레버리지',
    expense_ratio: 0.95,
    description: '나스닥 100의 일일 수익률 -3배를 추종하는 인버스 ETF입니다. 나스닥 하락에 베팅하거나 기존 포트폴리오를 헤지할 때 사용합니다. 장기 보유 시 시장 상승으로 인해 가치가 0에 가까워질 수 있어 단기 전술적 사용이 권장됩니다.',
  },
  {
    ticker: 'SH', name_ko: 'S&P500 인버스', name_en: 'ProShares Short S&P 500', category: '레버리지',
    expense_ratio: 0.88,
    description: 'S&P 500의 일일 수익률 -1배를 추종합니다. 레버리지 없는 인버스 ETF로 시장 하락에 대한 헤지 수단으로 사용됩니다. SQQQ 등 3배 인버스보다 변동성이 낮아 방어적 포지션에 활용됩니다.',
  },
  {
    ticker: 'SPXS', name_ko: 'S&P500 3배 인버스', name_en: 'Direxion Daily S&P 500 Bear 3X Shares', category: '레버리지',
    expense_ratio: 0.91,
    description: 'S&P 500의 일일 수익률 -3배를 추종합니다. 시장 급락 시 단기 수익 극대화 또는 포트폴리오 헤지 목적으로 사용됩니다. 장기 보유에는 매우 부적합하며 시장 상황을 면밀히 모니터링해야 합니다.',
  },
  // 글로벌
  {
    ticker: 'EEM', name_ko: 'iShares 이머징마켓', name_en: 'iShares MSCI Emerging Markets ETF', category: '글로벌',
    expense_ratio: 0.70,
    description: '중국·인도·한국·대만 등 이머징 마켓 주요 기업에 투자합니다. 선진국 대비 성장 잠재력이 높지만 통화 리스크·정치 리스크가 있습니다. 미국 시장에 쏠린 포트폴리오의 분산 효과를 기대할 수 있습니다.',
  },
  {
    ticker: 'EFA', name_ko: 'iShares 선진국 (미국 제외)', name_en: 'iShares MSCI EAFE ETF', category: '글로벌',
    expense_ratio: 0.32,
    description: '유럽·호주·일본 등 미국을 제외한 선진국 주식에 투자합니다. MSCI EAFE 지수를 추종하며 약 900개 종목을 담습니다. 미국 증시와 다른 사이클을 보여 글로벌 분산 투자의 핵심 자산으로 활용됩니다.',
  },
  {
    ticker: 'VEA', name_ko: '뱅가드 선진국 (미국 제외)', name_en: 'Vanguard FTSE Developed Markets ETF', category: '글로벌',
    expense_ratio: 0.05,
    description: 'EFA와 유사하게 미국 제외 선진국에 투자하지만 수수료가 0.05%로 훨씬 낮습니다. 뱅가드 특유의 저비용 구조로 장기 투자에 유리하며, 약 4,000개 종목을 포함해 더 광범위한 분산이 됩니다.',
  },
  {
    ticker: 'VWO', name_ko: '뱅가드 이머징마켓', name_en: 'Vanguard FTSE Emerging Markets ETF', category: '글로벌',
    expense_ratio: 0.08,
    description: '이머징 마켓 ETF 중 수수료가 0.08%로 EEM(0.70%) 대비 매우 저렴합니다. 중국·인도·브라질·대만 등 이머징 국가 약 5,000개 종목에 분산 투자합니다. 장기 이머징 투자라면 EEM보다 유리한 선택입니다.',
  },
  {
    ticker: 'IEFA', name_ko: 'iShares 코어 MSCI EAFE', name_en: 'iShares Core MSCI EAFE ETF', category: '글로벌',
    expense_ratio: 0.07,
    description: 'EFA의 저비용 버전으로, 미국 제외 선진국에 투자하면서 수수료를 0.07%로 낮췄습니다. 약 2,800개 종목을 포함해 EFA 대비 더 많은 중소형주를 담습니다. 선진국 글로벌 분산을 저비용으로 실현할 수 있는 ETF입니다.',
  },
];

export const PORTFOLIO_TEMPLATES = [
  {
    id: 'balanced',
    name: '황금 비율형',
    description: '성장과 배당의 균형',
    emoji: '⚖️',
    holdings: [{ ticker: 'QQQ', weight: 50 }, { ticker: 'SCHD', weight: 50 }],
  },
  {
    id: 'dividend',
    name: '배당 인컴형',
    description: '매달 배당금 받기',
    emoji: '💰',
    holdings: [{ ticker: 'SCHD', weight: 50 }, { ticker: 'JEPI', weight: 50 }],
  },
  {
    id: 'growth',
    name: '나스닥 집중형',
    description: '공격적 성장 추구',
    emoji: '🚀',
    holdings: [{ ticker: 'QQQ', weight: 70 }, { ticker: 'QLD', weight: 30 }],
  },
  {
    id: 'stable',
    name: '안정 성장형',
    description: '리스크 최소화',
    emoji: '🛡️',
    holdings: [{ ticker: 'SPY', weight: 60 }, { ticker: 'BND', weight: 40 }],
  },
  {
    id: 'allweather',
    name: '올웨더형',
    description: '시장 중립 포트폴리오',
    emoji: '🌤️',
    holdings: [
      { ticker: 'SPY', weight: 40 },
      { ticker: 'GLD', weight: 20 },
      { ticker: 'TLT', weight: 40 },
    ],
  },
];
