'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">app1 documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AgoraConfig.html" data-type="entity-link" >AgoraConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AudioCallScreenProps.html" data-type="entity-link" >AudioCallScreenProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthContextProps.html" data-type="entity-link" >AuthContextProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ButtonProps.html" data-type="entity-link" >ButtonProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CallData.html" data-type="entity-link" >CallData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CallSession.html" data-type="entity-link" >CallSession</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CallSessionProps.html" data-type="entity-link" >CallSessionProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatHeaderProps.html" data-type="entity-link" >ChatHeaderProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatHeaderProps-1.html" data-type="entity-link" >ChatHeaderProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatItem.html" data-type="entity-link" >ChatItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChatMessageItemProps.html" data-type="entity-link" >ChatMessageItemProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Contact.html" data-type="entity-link" >Contact</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ContactSectionProps.html" data-type="entity-link" >ContactSectionProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ContactSectionsType.html" data-type="entity-link" >ContactSectionsType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DefaultCallControlsProps.html" data-type="entity-link" >DefaultCallControlsProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FlatButtonProps.html" data-type="entity-link" >FlatButtonProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FlatTextInputProps.html" data-type="entity-link" >FlatTextInputProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GoogleAuthResponse.html" data-type="entity-link" >GoogleAuthResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IconButtonProps.html" data-type="entity-link" >IconButtonProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IncomingCallScreenProps.html" data-type="entity-link" >IncomingCallScreenProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IncomingCallScreenWrapperProps.html" data-type="entity-link" >IncomingCallScreenWrapperProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Invitation.html" data-type="entity-link" >Invitation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InviteFormProps.html" data-type="entity-link" >InviteFormProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Message.html" data-type="entity-link" >Message</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PendingInvitationsProps.html" data-type="entity-link" >PendingInvitationsProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SearchBarProps.html" data-type="entity-link" >SearchBarProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SegmentedControlProps.html" data-type="entity-link" >SegmentedControlProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserData.html" data-type="entity-link" >UserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserDataContextProps.html" data-type="entity-link" >UserDataContextProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserInfoProps.html" data-type="entity-link" >UserInfoProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VideoCallControlsProps.html" data-type="entity-link" >VideoCallControlsProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VideoCallScreenProps.html" data-type="entity-link" >VideoCallScreenProps</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});