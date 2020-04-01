exports.inputValues = {
  points_per_tag: {
      single_lower: {
          basic: 1,
          core: 2
      },
      single_acronym: {
          basic: 1.5,
          core: 4.5
      },
      single_capital: {
          basic: 1.5,
          core: 4.5
      },
      multi_capital: {
          basic: 2,
          core: 6
      },
      single_title: {
          basic: 3,
          core: 9
      },
      multi_title: {
          basic: 3,
          core: 9
      },
      url_identifier: {
          url: 8
      },
      url_domain: {
          url: 1
      },
      url_slugs: {
          url: 6
      },
  },
  points_bonus_multiplier: 1.5,
  topics: {
    niche_points_cutoff: 3,
    niche_counts_cutoff: 2,
  }
}