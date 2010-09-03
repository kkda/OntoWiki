<?php

/**
 * This file is part of the {@link http://ontowiki.net OntoWiki} project.
 *
 * @copyright Copyright (c) 2010, {@link http://aksw.org AKSW}
 * @license http://opensource.org/licenses/gpl-license.php GNU General Public License (GPL)
 */

/**
 * OntoWiki URL view helper
 *
 * This helper takes a URI and renders it as a link taking into account
 * the route for the current request.
 *
 * @category OntoWiki
 * @copyright Copyright (c) 2010, {@link http://aksw.org AKSW}
 * @license http://opensource.org/licenses/gpl-license.php GNU General Public License (GPL)
 */
class Site_View_Helper_Objectlist extends Zend_View_Helper_Abstract
{
    public function objectlist($objectArray, $titleHelper, $separator = ', ')
    {
        $list = array();
        foreach ((array) $objectArray as $object) {
            if (isset($object['type'])) {
                if ($object['type'] == 'uri') {
                    $link = sprintf('<a href="%s">%s</a>', $object['value'], $titleHelper->getTitle($object['value']));
                    array_push($list, $link);
                } else {
                    array_push($list, $object['value']);
                }
            }
        }
        
        return implode($separator, $list);
    }
}
