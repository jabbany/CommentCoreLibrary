'use strict'
describe 'CommentFilter', ->
  filter = null
  comment =
    'mode': 1
    'stime': 0
    'text': 'Foo Bar Baz'
    'date': 1000
    'size': 25
    'color': 0xffffff
  commentAlt =
    'mode': 1
    'stime': 0
    'text': 'Foo Bar Baz Foz'
    'date': 2000
    'size': 50
    'color': 0xff0000
  commentNoMode =
    'stime': 1
    'text': 'This comment has no mode'

  ruleAccept =
    'mode': 'accept'
    'subject': 'size'
    'op': '<'
    'value': 50
  ruleReject =
    'mode': 'reject'
    'subject': 'color'
    'op': '='
    'value': 0xffffff
  ruleNot =
    'mode': 'accept'
    'subject': ''
    'op': 'not'
    'value':
      'subject': 'text.length'
      'op': '<'
      'value': 15
  ruleOr =
    'mode': 'accept'
    'subject': ''
    'op': 'or'
    'value': [
      {
        'subject': 'date'
        'op': '<'
        'value': 2000
      }
      {
        'subject': 'text'
        'op': '~'
        'value': '.oz'
      }
    ]

  describe 'instance API', ->
    beforeEach ->
      filter = new CommentFilter()

    'doModify beforeSend doValidate addRule
    addModifier'.split(/\s/).forEach (method)->

      it "has method: '#{method}'", ->
        expect(typeof filter[method]).toBe 'function'

    describe 'defaults', ->
      it 'does not have any modifiers', ->
        expect(filter.modifiers.length).toBe 0

      it 'does not have any rules', ->
        expect(filter.rules.length).toBe 0

    describe '.doModify', ->
      beforeEach ->
        filter = new CommentFilter()

      it 'does nothing if no modifier', ->
        expect(filter.doModify comment).toBe comment

      it 'executes modifier', ->
        spy = sinon.stub().returns('Foo')
        filter.addModifier spy
        expect(filter.doModify comment).toBe 'Foo'
        expect(spy).toHaveBeenCalledWith(comment)

    describe '.beforeSend', ->
      it 'does nothing', ->
        expect(filter.beforeSend comment).toBe comment

    describe '.doValidate', ->
      alienModeComment =
        'mode': 1000
        'stime': 10
        'text': 'BAZ'
        'size': 10

      beforeEach ->
        filter = new CommentFilter()

      it 'passes valiadation valid mode', ->
        expect(filter.doValidate comment).toBe true

      it 'fails validation invalid mode', ->
        filter.allowTypes['1'] = false
        expect(filter.doValidate comment).toBe false

      it 'fails validation on no-mode comments', ->
        expect(filter.doValidate commentNoMode).toBe false

      it 'passes validation unknown mode', ->
        expect(filter.doValidate alienModeComment).toBe true

      it 'fails validation if allowUnknownTypes false', ->
        filter.allowUnknownTypes = false
        expect(filter.doValidate alienModeComment).toBe false

      it 'executes accept rules', ->
        filter.addRule ruleAccept
        expect(filter.doValidate comment).toBe true
        expect(filter.doValidate commentAlt).toBe false

      it 'executes reject rules', ->
        filter.addRule ruleReject
        expect(filter.rules.length).toBe 1
        expect(filter.doValidate comment).toBe false
        expect(filter.doValidate commentAlt).toBe true

      it 'implicitly ANDs rules', ->
        filter.addRule ruleAccept
        filter.addRule ruleReject
        expect(filter.doValidate comment).toBe false
        expect(filter.doValidate commentAlt).toBe false

      it 'matches OR rules', ->
        filter.addRule ruleOr
        expect(filter.doValidate comment).toBe true
        expect(filter.doValidate commentAlt).toBe true

      it 'matches NOT rules', ->
        filter.addRule ruleNot
        expect(filter.doValidate comment).toBe false
        expect(filter.doValidate commentAlt).toBe true

    describe '.addRule', ->
      rule =
        'mode': 'reject',
        'subject': 'text',
        'op': '=',
        'value': 'Foo'

      it 'adds a valid rule', ->
        filter.addRule rule
        expect(filter.rules.length).toBe 1
        expect(filter.rules[0]).toBe rule

      it 'rejects adding invalid rule', ->
        expect( =>
          filter.addRule
            'mode': '???').toThrow()

    describe '.addModifier', ->
      modifier = (cmt) ->
        cmt.color = 0xffffff
        cmt

      it 'adds a valid modifier', ->
        filter.addModifier modifier
        expect(filter.modifiers.length).toBe 1
        expect(filter.modifiers[0]).toBe modifier

      it 'rejects invalid modifier', ->
        expect( => filter.addModifier 'Boo').toThrow()
