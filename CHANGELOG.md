# Changelog

## [0.24.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.23.0...sicap-v0.24.0) (2026-09-24)


### Features

* **rate-limit:** enhance rate limiting with per-minute and per-day limits ([4e49af7](https://github.com/ciocan/SICAP.ai/commit/4e49af706c3049ec8ee9efeee1f5cd0360ab22c4))

## [0.23.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.22.0...sicap-v0.23.0) (2026-09-04)


### Features

* **company:** embed the harta-firmelor.ro registry card ([6a9248f](https://github.com/ciocan/SICAP.ai/commit/6a9248fe52ed8dae6b0d5c35ff3a2cc4b4f3fdbe))
* **company:** embed the harta-firmelor.ro registry card ([66dba37](https://github.com/ciocan/SICAP.ai/commit/66dba37ac7d03e5293c1c1aa3517b67e2d7ed096))


### Bug Fixes

* Eroare la cautare avansata dupa cui [#77](https://github.com/ciocan/SICAP.ai/issues/77) ([cb2598b](https://github.com/ciocan/SICAP.ai/commit/cb2598b11543dd0c109427c2b0f72693c7aa3282))

## [0.22.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.21.0...sicap-v0.22.0) (2026-05-28)


### Features

* Add ShareMethodologyTooltip component and integrate it into CompanyAll ([06cd451](https://github.com/ciocan/SICAP.ai/commit/06cd4517b832b0d6b0d9e11174c40b70d1281d39))
* Enhance ListItem component with winners count and awarded value display ([ec37ff3](https://github.com/ciocan/SICAP.ai/commit/ec37ff3aac86601907d2c00721ac43057d5377ed))
* Improve contract value aggregation logic in getCompanyByNationalId ([f85cf3b](https://github.com/ciocan/SICAP.ai/commit/f85cf3b684582c91b5d744285c4e61ff63bb8807))

## [0.21.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.20.0...sicap-v0.21.0) (2026-05-27)


### Features

* Add company representative related companies ([5a38e12](https://github.com/ciocan/SICAP.ai/commit/5a38e129e183691984c1e60a6e0a5d7c9cd95590))
* Enhance company page with ONRC and MFP financial data integration ([eacc498](https://github.com/ciocan/SICAP.ai/commit/eacc498a009b68077651286e27f616effa5dd49f))
* **mcp:** add compact-row projection and pagination clamp (TDD) ([d24a23a](https://github.com/ciocan/SICAP.ai/commit/d24a23ae63a72a890f6a2c3e1a4f7ec94e0d8ffa))
* **mcp:** add contract-type dispatch helper ([a17ea6c](https://github.com/ciocan/SICAP.ai/commit/a17ea6c93af08e111a9b42d24c9cb9593dcd25b8))
* **mcp:** add MCP route with 6 read-only procurement tools ([5f25f55](https://github.com/ciocan/SICAP.ai/commit/5f25f55e1f11df2d5b30317c9f4d3acca167155e))
* **mcp:** add OAuth consent page ([e9ea919](https://github.com/ciocan/SICAP.ai/commit/e9ea9191fd125e7eafea8772f4c8f63cb6d56cf7))
* **mcp:** add public /mcp connector docs page ([53e08d0](https://github.com/ciocan/SICAP.ai/commit/53e08d00f1c0648ad32a35da032d1f1e8e0f08fc))
* **mcp:** add Turso-backed per-user rate limiter ([a4aa86d](https://github.com/ciocan/SICAP.ai/commit/a4aa86d2bda9e1c00453f4650744be8f674fd321))
* **mcp:** enable Better Auth mcp plugin + OAuth/rate-limit schema ([a6a8ed6](https://github.com/ciocan/SICAP.ai/commit/a6a8ed6edb192e5b19d100c5284843932b81b525))
* **mcp:** enhance MCP integration and UI components ([e633334](https://github.com/ciocan/SICAP.ai/commit/e63333471c50b1144b1809600120a92f2628aba5))
* **mcp:** expose OAuth discovery + protected-resource metadata ([7910809](https://github.com/ciocan/SICAP.ai/commit/791080923b62baf97cdb8146d2c82b3c91f233be))
* **mcp:** implement CORS support for OAuth and MCP endpoints ([373c129](https://github.com/ciocan/SICAP.ai/commit/373c129aad50300e2b82bc96c1f05be1a7fafe0a))


### Bug Fixes

* **mcp:** add CORS headers to the /api/mcp route ([d5e0643](https://github.com/ciocan/SICAP.ai/commit/d5e0643a4f07ac052642cc20536eff8050daceb9))
* **mcp:** map ES index to slug for correct contract URLs and dispatch ([cbee842](https://github.com/ciocan/SICAP.ai/commit/cbee842cd3e49079f28cb9081cce4e95669ba683))

## [0.20.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.19.2...sicap-v0.20.0) (2026-05-26)


### Features

* migrate from NextAuth to Better Auth ([680de68](https://github.com/ciocan/SICAP.ai/commit/680de680a4131e162297e7d0bff037922501420b))

## [0.19.2](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.19.1...sicap-v0.19.2) (2026-05-05)


### Bug Fixes

* improve session handling in authentication and search pages ([dac2518](https://github.com/ciocan/SICAP.ai/commit/dac25189d1d7f42dcad63ca5b8d689a57d4f777e))

## [0.19.1](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.19.0...sicap-v0.19.1) (2026-05-05)


### Bug Fixes

* enhance CUI search handling in searchContracts ([116253e](https://github.com/ciocan/SICAP.ai/commit/116253e5791efdfa4dbfa58109924e11e03d37bd))

## [0.19.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.18.1...sicap-v0.19.0) (2026-02-25)


### Features

* add non-awarded contracts data to authority and company components ([776c76c](https://github.com/ciocan/SICAP.ai/commit/776c76c36aeb86fb5b248d757a390e3b3583d16c))

## [0.18.1](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.18.0...sicap-v0.18.1) (2026-01-15)


### Bug Fixes

* enhance CUI filtering in search functionality ([9bd3663](https://github.com/ciocan/SICAP.ai/commit/9bd3663141ad1942b9a498cf76faa5601de0b7f1))
* update ErrorPage to handle async search parameters ([3c7df3b](https://github.com/ciocan/SICAP.ai/commit/3c7df3b1ad7c1a068c4d042a66c2b4620f5a4eb1))

## [0.18.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.17.0...sicap-v0.18.0) (2026-01-15)


### Features

* enhance search functionality with CUI support ([dc2e61e](https://github.com/ciocan/SICAP.ai/commit/dc2e61ef43f937e3e106c85726deaf95a66627a1))

## [0.17.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.16.6...sicap-v0.17.0) (2026-01-12)


### Features

* integrate connection handling across components ([9a38795](https://github.com/ciocan/SICAP.ai/commit/9a38795d2f9e83c40382d758c46181a6ea8ea462))


### Bug Fixes

* disable component caching in Next.js configuration ([b5b5b78](https://github.com/ciocan/SICAP.ai/commit/b5b5b782f78d74fd5e8f67e8df8fe7a4e67ad657))
* resolve parameter handling and enhance caching headers in OG route ([51f4d9d](https://github.com/ciocan/SICAP.ai/commit/51f4d9d1aaefd7460ee278089eb4278c2aa49d29))

## [0.16.6](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.16.5...sicap-v0.16.6) (2025-12-31)


### Bug Fixes

* update authorization method and handle empty subscriber results ([43e148e](https://github.com/ciocan/SICAP.ai/commit/43e148e869f11f540c8edf151ffb5271f75921ce))

## [0.16.5](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.16.4...sicap-v0.16.5) (2025-12-22)


### Bug Fixes

* add calculateLicitatiiWinningValue function and enhance getCompanyByNationalId ([47c3162](https://github.com/ciocan/SICAP.ai/commit/47c31623cb67774d724a0125344116906d647e46))
* enhance getAuthorityByNationalId function to improve field extraction ([d172008](https://github.com/ciocan/SICAP.ai/commit/d172008a61d5a82c1a8780435cc00b059156e020))
* enhance getCompanyByNationalId to support winners array and improve field extraction ([d2b58b6](https://github.com/ciocan/SICAP.ai/commit/d2b58b619bdadf7e5af6e49bb3c23ad724382e67))
* ensure API responses are fully serializable ([6bee978](https://github.com/ciocan/SICAP.ai/commit/6bee97856b39bfb553666f2a3f982d942535c1fd))
* update caching strategy and clean up unused code ([d78d442](https://github.com/ciocan/SICAP.ai/commit/d78d442d2e78d8756acac8ccd1b984eb682e2899))

## [0.16.4](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.16.3...sicap-v0.16.4) (2025-12-21)


### Bug Fixes

* enhance contract component to display lot winners ([d88eba8](https://github.com/ciocan/SICAP.ai/commit/d88eba8ba0d6ca803c5178876386217d8bcae357))

## [0.16.3](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.16.2...sicap-v0.16.3) (2025-12-21)


### Bug Fixes

* add nationalIDNumber to caNoticeEdit_New_U__section1_New_U__section1_1__caAddress ([ee8b725](https://github.com/ciocan/SICAP.ai/commit/ee8b725e189c4b9d4780c1bfc0b36e57e479d2ad))
* enhance contract component to support fiscalNumberInt for winners ([440d1e0](https://github.com/ciocan/SICAP.ai/commit/440d1e011ff24b8a14ba7a8e19df8e1c8d051349))
* improve winner selection logic in getCompanyByNationalId function ([1695ac2](https://github.com/ciocan/SICAP.ai/commit/1695ac2c65668cc4b7b30d332e266b7a4ce8120c))
* update link generation for authorities and suppliers in contract pages ([0804966](https://github.com/ciocan/SICAP.ai/commit/080496661dfdfb5dd28e7167cf66df8d90c3a916))

## [0.16.2](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.16.1...sicap-v0.16.2) (2025-12-21)


### Bug Fixes

* same amount value for suppliers list on the authority page ([9e332d5](https://github.com/ciocan/SICAP.ai/commit/9e332d5db6b61b6ab7c38d64da9852704cd585e2))

## [0.16.1](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.16.0...sicap-v0.16.1) (2025-12-21)


### Bug Fixes

* update storageKey handling in EmbedThemeProvider ([7c05b30](https://github.com/ciocan/SICAP.ai/commit/7c05b3092040bf4629a2d6c2bdd9f4b48f1b56e9))

## [0.16.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.15.1...sicap-v0.16.0) (2025-12-21)


### Features

* enhance embed widget with theme support ([7568a8b](https://github.com/ciocan/SICAP.ai/commit/7568a8b5c85d08802054721f8778c9e991c22b53))


### Bug Fixes

* authority comapnies list with same name and different CUI ([c9cf398](https://github.com/ciocan/SICAP.ai/commit/c9cf398e4571c011c7afa94b6ed101e061079084))
* update authority link generation in EmbedContent component ([94ece30](https://github.com/ciocan/SICAP.ai/commit/94ece30d7e210a7e4d6694dac5f242b50e224ad0))

## [0.15.1](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.15.0...sicap-v0.15.1) (2025-12-21)


### Bug Fixes

* ensure proper header usage in Footer component for Next.js Server Components ([83dc0b4](https://github.com/ciocan/SICAP.ai/commit/83dc0b43efa54dcb3a6b2afa857949e8a24b98a7))

## [0.15.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.14.0...sicap-v0.15.0) (2025-12-21)


### Features

* enhance ListItem component with improved layout and new external link icons ([4ffb40f](https://github.com/ciocan/SICAP.ai/commit/4ffb40f8855d3cfce3fa995b0678464c73ff42ec))
* redesign footer component for improved layout and accessibility ([5d7e1e1](https://github.com/ciocan/SICAP.ai/commit/5d7e1e110f623f44a22c1a98bb27ab9dd2fc687c))
* update ListItem and API types to include new authority / company pages using fiscal numbers ([5904878](https://github.com/ciocan/SICAP.ai/commit/59048789f02005e2d7af67ff4557077c1632385f))

## [0.14.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.13.0...sicap-v0.14.0) (2025-12-21)


### Features

* enhance ListItem component with locality links ([a39044b](https://github.com/ciocan/SICAP.ai/commit/a39044b75b31d04ab244a6a2950c77ac374fd750))

## [0.13.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.12.0...sicap-v0.13.0) (2025-12-21)


### Features

* implement page for city (localitate) ([69809a0](https://github.com/ciocan/SICAP.ai/commit/69809a04c4ca3db2e4ce3099f9346a155fec8a26))

## [0.12.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.11.0...sicap-v0.12.0) (2025-12-21)


### Features

* add Top Authorities component with charts and detailed list ([ed41d0e](https://github.com/ciocan/SICAP.ai/commit/ed41d0e6d4d81fa7010931661a1be2604ce93031))

## [0.11.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.10.0...sicap-v0.11.0) (2025-12-21)


### Features

* add Top Companies component with charts and detailed list on authority page ([2a8cce8](https://github.com/ciocan/SICAP.ai/commit/2a8cce8cc4ce532f5999248f0e27176da485b665))


### Bug Fixes

* add optional chaining to prevent errors in totalValue calculation ([60ceaf5](https://github.com/ciocan/SICAP.ai/commit/60ceaf5aaea83a66ac7e7a6ab9b68a0fbcd16eac))

## [0.10.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.9.0...sicap-v0.10.0) (2025-12-21)


### Features

* add company details page with links like /firma/nationalId ([d57f976](https://github.com/ciocan/SICAP.ai/commit/d57f9761f49d122bdc38fc7483e7ce333c02a35e))

## [0.9.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.8.0...sicap-v0.9.0) (2025-12-20)


### Features

* add authority page with links like /autoritate/nationalId ([151fff7](https://github.com/ciocan/SICAP.ai/commit/151fff7568daa4dca37d0c09bae4a71bcfb90c90))

## [0.8.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.7.1...sicap-v0.8.0) (2025-12-12)


### Features

* add embed functionality for public acquisitions ([4bafd8e](https://github.com/ciocan/SICAP.ai/commit/4bafd8eaf087978b061e3a772a22478d2333fb6f))

## [0.7.1](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.7.0...sicap-v0.7.1) (2025-12-12)


### Bug Fixes

* theme switcher ([fa2f0b6](https://github.com/ciocan/SICAP.ai/commit/fa2f0b6fd5bd598f5ae69c4e8b31eae411d3223f))

## [0.7.0](https://github.com/ciocan/SICAP.ai/compare/sicap-v0.6.1...sicap-v0.7.0) (2025-12-12)


### Features

* update searchContracts to use romanian stemming fields ([2dd4e45](https://github.com/ciocan/SICAP.ai/commit/2dd4e45064dcb6f58681703457a4029ed1944533))

## [0.6.1](https://github.com/ciocan/sicap.ai/compare/sicap-v0.6.0...sicap-v0.6.1) (2025-12-08)


### Bug Fixes

* improve layout and accessibility in main page and search component ([9ff5fe1](https://github.com/ciocan/sicap.ai/commit/9ff5fe1351c4ff9490415261a3e8bbb2f02a7c49))

## [0.6.0](https://github.com/ciocan/sicap.ai/compare/sicap-v0.5.0...sicap-v0.6.0) (2025-12-08)


### Features

* enhance ListItem component with index-based configuration ([650f258](https://github.com/ciocan/sicap.ai/commit/650f258b36060989b653be25879560250881e3ee))

## [0.5.0](https://github.com/ciocan/sicap.ai/compare/sicap-v0.4.0...sicap-v0.5.0) (2025-12-08)


### Features

* implement caching for API queries and enhance sitemap generation ([c66a612](https://github.com/ciocan/sicap.ai/commit/c66a612b7793c57699b5a12b8f443bf69915236d))


### Bug Fixes

* update sitemap entries and correct route types import ([ba7de66](https://github.com/ciocan/sicap.ai/commit/ba7de66f71bc3e2ad6b98bbf525cb2cff7b0cc13))

## [0.4.0](https://github.com/ciocan/sicap.ai/compare/sicap-v0.3.0...sicap-v0.4.0) (2025-12-08)


### Features

* upgrade Next.js to v16 and related dependencies ([5fd2ec6](https://github.com/ciocan/sicap.ai/commit/5fd2ec61773eff72d8f86877e64c23fde6241647))

## [0.3.0](https://github.com/ciocan/sicap.ai/compare/sicap-v0.2.0...sicap-v0.3.0) (2025-12-08)


### Features

* **create-turbo:** apply official-starter transform ([3cfbe5a](https://github.com/ciocan/sicap.ai/commit/3cfbe5a7b97e767937b42c67a9ec2fd1a4c0aeeb))
* **create-turbo:** apply pnpm-eslint transform ([7fbf479](https://github.com/ciocan/sicap.ai/commit/7fbf479568e9bf322d360b7330e3e9fa99ae8aea))
* **create-turbo:** install dependencies ([3414df9](https://github.com/ciocan/sicap.ai/commit/3414df952f6c2cb1b7ccaa61118e8277e5920064))
