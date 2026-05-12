import { PFilterLinks, PMatch } from './protocols'
import { GenerateHTMLKey } from './helpers'

import {
  DataRefined,
  schema_site_editor_default_collection_flags,
  schema_site_editor_default_linkField_filtered,
  schema_site_editor_default_option_content,
  schema_site_editor_default_screen_config_links
} from '../../_interfaces'
import { TextReplacer } from '../text-replacer/text-replacer'


export class FilterLinks implements PFilterLinks {
  constructor(
    private readonly matchs: PMatch[],
    private readonly refinedData: DataRefined,
    private readonly textReplacer: TextReplacer
  ) {
  }

  public filter(link: schema_site_editor_default_collection_flags): schema_site_editor_default_linkField_filtered | null {
    if (!this?.refinedData || !link || !link?.isActive) {

      return null
    }


    const {
      _screen_config_links = [],
      ...currentCollectionData
    } = link

    const linksToIterate = link?.withoutLink ? ([{ linksByMock: 'any_value_to_enter_on_iteration' }]) : _screen_config_links

    if ((!link.withoutLink && !link?._screen_config_links?.[0]) || (!link.withoutLink && JSON.stringify(link?._screen_config_links?.[0]) === '{}')) {
      return null
    }

    // @ts-ignore
    const linksMatcheds = Object?.keys(linksToIterate?.[0])?.reduce((acc: any, key: keyof schema_site_editor_default_screen_config_links) => {
      if (link?.withoutLink) {
        return {
          [GenerateHTMLKey(`match-occurs-by-option-without-link`)]: true,
          [GenerateHTMLKey(`match-by-without-link-option-site-editor--name-${link?.__editorItemTitle}`, false)]: true
        }
      }

      const currentLink = _screen_config_links?.[0]?.[key]

      const matcher = this?.matchs?.find(matcher => matcher.attributeLinkParent === key)

      if (!matcher) {
        return {
          ...acc
        }
      }

      const refinedDataMatch = this.refinedData?.[matcher?.attributeLinkRefinedData]

      if (!refinedDataMatch) {
        return {
          ...acc
        }
      }

      const result = matcher?.match(refinedDataMatch, currentLink)

      if (!result) {
        return {
          ...acc
        }
      }


      return {
        ...acc,
        ...result.HTMLMatch,
        [GenerateHTMLKey(`match-occurs-by-${matcher.attributeLinkRefinedData}-attr`)]: true
      }
    }, {}) as any

    if (!linksMatcheds || Object?.keys(linksMatcheds)?.length === 0) {
      return null
    }

    const collectionFiltered: schema_site_editor_default_option_content = (currentCollectionData?.items?.[0] as schema_site_editor_default_option_content)

    const textWithVariablesReplaced = this.textReplacer.replaceVars((collectionFiltered?.text), this.refinedData)

    if (!textWithVariablesReplaced && currentCollectionData?.typeContent === 'createContent') {
      return null
    }

    const replaceCurrentTextOfLink: Omit<schema_site_editor_default_collection_flags, '_screen_config_links'> = {
      ...currentCollectionData,
      items: [
        {
          ...currentCollectionData.items?.[0],
          text: textWithVariablesReplaced ?? undefined
        }
      ]
    }

    return {
      ...replaceCurrentTextOfLink,
      HTMLMatch: {
        ...linksMatcheds,
        [GenerateHTMLKey(`priority-value-${link?.priority}`)]: true,
        [GenerateHTMLKey(`type-content-${link?.typeContent}`)]: true,
        [GenerateHTMLKey(`link-name-${link?.__editorItemTitle}`)]: true,
        ...(!!link?.variant && ({ [GenerateHTMLKey(`variant-value-${link?.variant}`)]: true }))
      }
    }
  }
}
